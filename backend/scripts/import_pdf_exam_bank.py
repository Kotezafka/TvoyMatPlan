#!/usr/bin/env python3
"""Import the MathStart PDF banks into image-backed curriculum catalogs.

The source books contain stable ``task::ID`` and ``ans::ID`` PDF named
destinations.  This importer deliberately uses those destinations instead of
OCR: formulas and diagrams are kept in the rendered image and task IDs stay
stable when a PDF is imported again.  It is safe to run repeatedly for the
same source hash; generated files are overwritten with the same object keys.

The importer does not upload anything or activate a curriculum release.  The
bundle importer is responsible for those operations after this output has
been reviewed.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Sequence

import pymupdf
from PIL import Image
from pypdf import PdfReader


IMPORTER_VERSION = "pdf-exam-bank-1.0"
DEFAULT_YEAR = 2026
CONTENT_LEFT = 35.0
CONTENT_RIGHT = 560.0
CONTENT_TOP = 45.0
CONTINUATION_TOP = 70.0
CONTENT_BOTTOM = 780.0
CONTINUATION_THRESHOLD = 740.0
TASK_DESTINATION_RE = re.compile(r"^task::(\d+(?:\.\d+){1,2})$")
ANSWER_DESTINATION_RE = re.compile(r"^ans::(\d+(?:\.\d+){1,2})$")

TOPIC_TITLES: dict[str, dict[int, str]] = {
    "ege_base": {
        1: "Простые текстовые задачи",
        2: "Единицы измерения",
        3: "Таблицы, графики и диаграммы",
        4: "Расчёты по формулам",
        5: "Вероятности",
        6: "Задачи на оптимальный выбор",
        7: "Функции. Установление соответствия",
        8: "Анализ утверждений",
        9: "Задачи на клетчатой бумаге",
        10: "Практическая планиметрия",
        11: "Практическая стереометрия",
        12: "Планиметрия",
        13: "Стереометрия",
        14: "Вычисления с дробями",
        15: "Процентные вычисления",
        16: "Вычисления и преобразования",
        17: "Уравнения",
        18: "Неравенства",
        19: "Целые числа",
        20: "Текстовые задачи",
        21: "Нестандартные задачи",
    },
    "ege_profile": {
        1: "Планиметрия 1",
        2: "Векторы",
        3: "Стереометрия 1",
        4: "Вероятность 1",
        5: "Вероятность 2",
        6: "Случайные величины",
        7: "Уравнения 1",
        8: "Вычисления и преобразования",
        9: "Производная и её график",
        10: "Задачи с прикладным содержанием",
        11: "Текстовые задачи",
        12: "Анализ графика",
        13: "Финансовые задачи",
        14: "Уравнения 2",
        15: "Стереометрия 2",
        16: "Неравенства",
        17: "Экстремальные задачи",
        18: "Планиметрия 2",
        19: "Задачи с параметром",
        20: "Нестандартные задачи",
        21: "Поиск экстремума (legacy)",
    },
}

TRACK_TITLES = {
    "ege_base": "ЕГЭ по математике · базовый уровень",
    "ege_profile": "ЕГЭ по математике · профильный уровень",
}


@dataclass(frozen=True)
class TaskAnchor:
    """A task destination converted to PyMuPDF page coordinates."""

    external_id: str
    page_index: int
    x: float
    top: float
    anchor_y: float


@dataclass(frozen=True)
class TaskRegion:
    page_index: int
    clip: pymupdf.Rect


def _numeric_id_key(value: str) -> tuple[int, ...]:
    return tuple(int(part) for part in value.split("."))


def _destination_page(reader: PdfReader, destination: Any) -> int | None:
    try:
        page = reader.get_destination_page_number(destination)
    except (KeyError, TypeError, ValueError, IndexError):
        return None
    return page if isinstance(page, int) and page >= 0 else None


def _destination_field(destination: Any, name: str) -> Any:
    value = getattr(destination, name, None)
    if value is not None:
        return value
    # pypdf may return a dictionary-like destination for hand-built fixtures.
    try:
        return destination[f"/{name.capitalize()}"]
    except (KeyError, TypeError, AttributeError):
        return None


def discover_tasks(reader: PdfReader, track: str) -> tuple[list[TaskAnchor], list[dict[str, Any]]]:
    """Return valid task anchors and a report of malformed task destinations.

    ``track`` is validated here because profile question 21 has an explicitly
    supported legacy policy, while the destination parser itself is shared by
    both books.
    """

    if track not in TRACK_TITLES:
        raise ValueError(f"unsupported track: {track}")
    discovered: list[TaskAnchor] = []
    malformed: list[dict[str, Any]] = []
    destination_names = {str(name) for name in reader.named_destinations}
    for name, destination in reader.named_destinations.items():
        match = TASK_DESTINATION_RE.fullmatch(str(name))
        if not match:
            continue
        source_id = match.group(1)
        page_index = _destination_page(reader, destination)
        top = _destination_field(destination, "top")
        left = _destination_field(destination, "left")
        typ = str(_destination_field(destination, "typ") or "")
        reasons: list[str] = []
        if page_index is None or top is None or left is None or typ == "/Fit":
            if typ == "/Fit":
                reasons.append("destination uses page-wide /Fit and has no task crop coordinates")
            else:
                reasons.append("task destination has no usable /XYZ page coordinate")
        if f"ans::{source_id}" not in destination_names:
            reasons.append("task destination has no paired answer destination")
        if reasons:
            malformed.append(
                {
                    "sourceTaskId": source_id,
                    "destination": str(name),
                    "page": page_index + 1 if page_index is not None else None,
                    "destinationType": typ or None,
                    "reason": "; ".join(reasons),
                }
            )
            continue
        try:
            top_float = float(top)
            left_float = float(left)
        except (TypeError, ValueError):
            malformed.append(
                {
                    "sourceTaskId": source_id,
                    "destination": str(name),
                    "page": page_index + 1,
                    "reason": "destination coordinates are not numeric",
                }
            )
            continue
        # PDF coordinates use a bottom-origin; PyMuPDF uses a top-origin.
        # Page height is only needed when regions are built, so retain `top`
        # here and convert there with the actual page rectangle.
        discovered.append(
            TaskAnchor(
                external_id=source_id,
                page_index=page_index,
                x=left_float,
                top=top_float,
                anchor_y=top_float,
            )
        )
    # PDF named-destination `/Top` gets smaller as the reader moves down a
    # page, so descending `/Top` is top-to-bottom in document order.
    discovered.sort(key=lambda task: (task.page_index, -task.top, _numeric_id_key(task.external_id)))
    return discovered, malformed


def _anchor_y(anchor: TaskAnchor, page: pymupdf.Page) -> float:
    return page.rect.height - anchor.top


def _content_bottom(page: pymupdf.Page, start_y: float = CONTENT_TOP) -> float:
    """Find a stable bottom bound while avoiding the book's navigation footer."""

    # The source books use the same A4 layout.  Measure visible text/drawings
    # after the task start; the fixed ceiling excludes the repeated footer.
    content_ends: list[float] = []
    try:
        for block in page.get_text("blocks"):
            y0, y1 = float(block[1]), float(block[3])
            text = str(block[4] or "").strip().lower()
            if y0 >= start_y and y0 < CONTENT_BOTTOM - 5 and y1 < CONTENT_BOTTOM:
                if "оглавление" in text and y0 > page.rect.height * 0.82:
                    continue
                if "справочный материал" in text and y0 > page.rect.height * 0.82:
                    continue
                content_ends.append(y1)
        for drawing in page.get_drawings():
            rect = drawing.get("rect")
            if rect and rect.y0 >= start_y and rect.y0 < CONTENT_BOTTOM - 5:
                content_ends.append(float(rect.y1))
    except Exception:
        pass
    measured = max(content_ends, default=start_y + 1) + 8
    return min(CONTENT_BOTTOM, max(start_y + 1, measured))


def _has_continuation_content(page: pymupdf.Page, clip: pymupdf.Rect) -> bool:
    """Reject page headings and blank tails when checking a page break."""

    # If the next task begins immediately below the page header there is no
    # meaningful room for a continuation segment; broad header rules are
    # represented as large vector drawings and would otherwise look like a
    # figure.
    if clip.height < 80:
        return False

    text = page.get_text("text", clip=clip)
    for line in text.splitlines():
        clean = re.sub(r"\s+", " ", line).strip()
        if not clean:
            continue
        if re.match(
            r"^(?:Задача|ЗАДАЧИ|СТАРЫЕ ЗАДАЧИ|№\s*\d+\.|Оглавление|Справочный материал|Библиотека MathStart)",
            clean,
            re.IGNORECASE,
        ):
            continue
        # Subsection titles at the top of a new page are short and end in a
        # period; they introduce the next group rather than continue a task.
        if "продолж" in clean.lower():
            return True
        if len(clean) < 42 and clean.endswith(".") and len(clean.split()) <= 5:
            continue
        if len(clean) >= 24 or len(clean.split()) >= 5:
            return True
    # Image-only/vector-only continuations are possible.  Ignore small rules,
    # footer marks, and page decorations; real figures occupy meaningful area.
    for drawing in page.get_drawings():
        rect = drawing.get("rect")
        if not rect:
            continue
        # Full-page background rectangles and crops are page decoration, not
        # task continuation. Only count bounded vector figures.
        if rect.width >= page.rect.width * 0.9 or rect.height >= page.rect.height * 0.9:
            continue
        overlap = rect & clip
        if overlap.is_empty:
            continue
        if overlap.y1 <= CONTINUATION_TOP + 45 or overlap.height < 24:
            continue
        if overlap.width * overlap.height >= 1800:
            return True
    return False


def task_regions(task: TaskAnchor, tasks: Sequence[TaskAnchor], document: pymupdf.Document) -> list[TaskRegion]:
    """Build page clips from one task anchor to the next task anchor.

    A task can cross page boundaries.  Every returned segment has the same
    horizontal content bounds and omits repeated footer/navigation material.
    """

    try:
        index = next(i for i, candidate in enumerate(tasks) if candidate == task)
    except StopIteration as error:
        raise ValueError(f"task {task.external_id!r} is not in task list") from error
    next_task = tasks[index + 1] if index + 1 < len(tasks) else None
    first_page = document[task.page_index]
    start_y = max(CONTENT_TOP, _anchor_y(task, first_page) - 7)
    regions: list[TaskRegion] = []
    current_end_page = task.page_index
    if next_task and next_task.page_index > task.page_index:
        # Carry a task onto the next page only when visible content reaches
        # the bottom area.  This avoids gluing the next page's topic header to
        # a task that ended normally.
        page = document[task.page_index]
        if _content_bottom(page, start_y) >= CONTINUATION_THRESHOLD:
            next_page = document[next_task.page_index]
            candidate_end = min(
                _content_bottom(next_page, CONTINUATION_TOP),
                _anchor_y(next_task, next_page) - 7,
            )
            candidate = pymupdf.Rect(
                CONTENT_LEFT,
                CONTINUATION_TOP,
                min(next_page.rect.width, CONTENT_RIGHT),
                max(CONTINUATION_TOP + 1, candidate_end),
            )
            if _has_continuation_content(next_page, candidate):
                current_end_page = next_task.page_index
    for page_index in range(task.page_index, current_end_page + 1):
        page = document[page_index]
        top = start_y if page_index == task.page_index else CONTINUATION_TOP
        if next_task and page_index == next_task.page_index:
            end = _anchor_y(next_task, page) - 7
        else:
            end = _content_bottom(page, top)
        end = min(_content_bottom(page, top), end)
        top = min(max(0.0, top), page.rect.height)
        end = min(max(top + 1.0, end), page.rect.height)
        clip = pymupdf.Rect(
            max(0.0, CONTENT_LEFT),
            top,
            min(page.rect.width, CONTENT_RIGHT),
            end,
        )
        if clip.height > 1 and clip.width > 1:
            regions.append(TaskRegion(page_index=page_index, clip=clip))
    return regions


def text_in_regions(document: pymupdf.Document, regions: Sequence[TaskRegion]) -> str:
    parts: list[str] = []
    for region in regions:
        page = document[region.page_index]
        text = page.get_text("text", clip=region.clip)
        for line in text.splitlines():
            clean = re.sub(r"\s+", " ", line).strip()
            if not clean or clean.lower().startswith("оглавление"):
                continue
            if clean.lower().startswith("справочный материал"):
                continue
            clean = re.sub(r"\s+(?:Аналоги?|Analog(?:ues)?)\s+Ответ\s*:?[ ]*$", "", clean, flags=re.IGNORECASE)
            if clean.lower() in {"ответ", "ответ:", "аналоги", "аналог"}:
                continue
            parts.append(clean)
    return " ".join(parts).strip()


def _line_records(page: pymupdf.Page) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    dictionary = page.get_text("dict")
    for block_index, block in enumerate(dictionary.get("blocks", [])):
        if block.get("type") != 0:
            continue
        for line_index, line in enumerate(block.get("lines", [])):
            spans = line.get("spans", [])
            text = "".join(str(span.get("text", "")) for span in spans).strip()
            if not text:
                continue
            bbox = line.get("bbox") or (0, 0, 0, 0)
            records.append(
                {
                    "block": block_index,
                    "line": line_index,
                    "text": text,
                    "x0": float(bbox[0]),
                    "y0": float(bbox[1]),
                    "x1": float(bbox[2]),
                    "y1": float(bbox[3]),
                }
            )
    return records


def _answer_values(value: str) -> list[str]:
    clean = re.sub(r"\s+", " ", value).strip()
    clean = re.sub(r"\s*([,;])\s*", r"\1", clean)
    clean = re.sub(r"\s+([.)])", r"\1", clean)
    clean = clean.replace("−", "-")
    # A trailing dot is the punctuation used in the answer key, not a decimal
    # point.  Keep internal dots and all symbolic notation intact.
    clean = re.sub(r"(?<=\d)\.$", "", clean)
    if not clean:
        return []
    alternatives = re.split(r"\s+или\s+", clean, flags=re.IGNORECASE)
    return [candidate.strip() for candidate in alternatives if candidate.strip()]


def extract_answer(
    document: pymupdf.Document,
    reader: PdfReader,
    source_task_id: str,
    cache: dict[int, dict[str, Any]] | None = None,
) -> list[str]:
    """Extract the answer line following the matching answer-key label."""

    destination = reader.named_destinations.get(f"ans::{source_task_id}")
    if destination is None or str(_destination_field(destination, "typ") or "") == "/Fit":
        return []
    page_index = _destination_page(reader, destination)
    if page_index is None or page_index >= len(document):
        return []
    page = document[page_index]
    if cache is None:
        page_data = {"lines": _line_records(page), "words": page.get_text("words")}
    else:
        page_data = cache.setdefault(
            page_index,
            {"lines": _line_records(page), "words": page.get_text("words")},
        )
    lines_for_page = page_data["lines"]
    label = f"№{source_task_id}"
    label_records = [record for record in lines_for_page if record["text"] == label]
    dest_top = _destination_field(destination, "top")
    dest_y = page.rect.height - float(dest_top) if dest_top is not None else 0.0
    if label_records:
        record = min(
            label_records,
            key=lambda item: abs((item["y0"] + item["y1"]) / 2 - dest_y)
            + abs(item["x0"] - float(_destination_field(destination, "left") or item["x0"])) / 100,
        )
        # In the source PDF, the answer is the immediately following line in
        # the same text block.  Keep this path first because it handles answer
        # rows containing several labels and alternatives reliably.
        lines = [
            candidate
            for candidate in lines_for_page
            if candidate["block"] == record["block"]
            and candidate["line"] > record["line"]
            and not candidate["text"].startswith("№")
        ]
        if lines:
            following = min(lines, key=lambda item: item["line"])
            values = _answer_values(following["text"])
            if values:
                return values

    # Some PDF producers place the row label and answer in separate text
    # blocks with the same baseline.  Fall back to positioned words.
    words = page_data["words"]
    matching = [word for word in words if str(word[4]).strip() == label]
    if not matching:
        return []
    label_word = min(
        matching,
        key=lambda word: abs((float(word[1]) + float(word[3])) / 2 - dest_y),
    )
    baseline = (float(label_word[1]) + float(label_word[3])) / 2
    candidates = [
        word
        for word in words
        if float(word[0]) > float(label_word[2])
        and abs((float(word[1]) + float(word[3])) / 2 - baseline) <= 4.5
        and not str(word[4]).strip().startswith("№")
    ]
    # Do not consume the next answer column.  A same-row label is the hard
    # boundary even when the answer itself contains several words.
    next_labels = [
        float(word[0])
        for word in words
        if str(word[4]).strip().startswith("№") and float(word[0]) > float(label_word[2])
        and abs((float(word[1]) + float(word[3])) / 2 - baseline) <= 4.5
    ]
    limit = min(next_labels, default=float("inf"))
    candidates = [word for word in candidates if float(word[0]) < limit]
    candidates.sort(key=lambda word: (float(word[0]), float(word[1])))
    return _answer_values("".join(str(word[4]) for word in candidates))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def object_key(track: str, source_sha256: str, source_task_id: str, segment_index: int) -> str:
    if track not in TRACK_TITLES:
        raise ValueError(f"unsupported track: {track}")
    if not re.fullmatch(r"[0-9a-f]{64}", source_sha256):
        raise ValueError("source_sha256 must be a lowercase SHA-256 digest")
    if not TASK_DESTINATION_RE.fullmatch(f"task::{source_task_id}"):
        raise ValueError(f"invalid source task id: {source_task_id}")
    if not isinstance(segment_index, int) or segment_index < 0:
        raise ValueError("segment_index must be a non-negative integer")
    return (
        f"curriculum/assets/mathstart/{track}/{source_sha256}/"
        f"{source_task_id}/{segment_index}.webp"
    )


def _question_number(source_task_id: str) -> int:
    return int(source_task_id.split(".", 1)[0])


def catalog_task(
    *,
    source_task_id: str,
    track: str,
    statement: str,
    answer: Sequence[str],
    image_keys: Sequence[str],
    page_start: int,
    page_end: int,
    image_size: tuple[int, int],
    importer_version: str = IMPORTER_VERSION,
) -> dict[str, Any]:
    question_number = _question_number(source_task_id)
    is_profile_extended = track == "ege_profile" and 14 <= question_number <= 20
    is_legacy = track == "ege_profile" and question_number == 21
    metadata: dict[str, Any] = {
        "imageKeys": list(image_keys),
        "imageWidth": image_size[0],
        "imageHeight": image_size[1],
        "examQuestionNumber": question_number,
        "sourceTaskId": source_task_id,
        "sourcePageStart": page_start,
        "sourcePageEnd": page_end,
        "importerVersion": importer_version,
    }
    if track == "ege_base":
        metadata["examPart"] = 1
    elif question_number <= 20:
        metadata["examPart"] = 2 if question_number >= 14 else 1
    if is_legacy:
        metadata["isLegacy"] = True
    return {
        "externalId": source_task_id,
        "topicCode": f"Q{question_number}",
        "taskType": "fipi_exam_task",
        "difficulty": "advanced"
        if track == "ege_profile" and 14 <= question_number <= 20
        else "standard",
        "statement": statement or f"Задание {source_task_id}.",
        "acceptedAnswers": [] if is_profile_extended else list(answer),
        "metadata": metadata,
    }


def _render_region(
    page: pymupdf.Page,
    clip: pymupdf.Rect,
    target: Path,
    dpi: int,
) -> tuple[int, int]:
    scale = max(0.5, float(dpi) / 72.0)
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=clip, alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, format="WEBP", quality=88, method=6)
    return image.size


def _write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_import(
    input_pdf: str | Path,
    track: str,
    output_dir: str | Path,
    *,
    year: int = DEFAULT_YEAR,
    version: str | None = None,
    dpi: int = 144,
    render_images: bool = True,
    permission_provenance: str = "user-confirmed source permission",
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Build and write a catalog and validation report.

    ``render_images=False`` is used by validation/dry-run jobs and never
    creates image files.  The returned payload and report are also useful to
    callers that want to review counts before writing or uploading anything.
    """

    source_path = Path(input_pdf).expanduser().resolve()
    output = Path(output_dir).expanduser().resolve()
    if track not in TRACK_TITLES:
        raise ValueError(f"unsupported track: {track}")
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    source_hash = sha256_file(source_path)
    reader = PdfReader(str(source_path))
    document = pymupdf.open(str(source_path))
    try:
        tasks, malformed = discover_tasks(reader, track)
        answer_destinations = {
            match.group(1)
            for name in reader.named_destinations
            if (match := ANSWER_DESTINATION_RE.fullmatch(str(name)))
        }
        topic_numbers = sorted({_question_number(task.external_id) for task in tasks})
        titles = TOPIC_TITLES[track]
        topics = [
            {
                "code": f"Q{number}",
                "title": titles.get(number, f"Задание {number}"),
                "section": "Задачи с развёрнутым ответом" if track == "ege_profile" and number >= 14 else "Экзаменационные задания",
                "position": position,
            }
            for position, number in enumerate(topic_numbers, start=1)
        ]
        image_root = output / "images"
        catalog_tasks: list[dict[str, Any]] = []
        answer_page_cache: dict[int, dict[str, Any]] = {}
        image_count = 0
        missing_answers: list[str] = []
        missing_extracted_answers: list[str] = []
        tasks_with_answers = 0
        for task in tasks:
            regions = task_regions(task, tasks, document)
            if not regions:
                malformed.append(
                    {
                        "sourceTaskId": task.external_id,
                        "page": task.page_index + 1,
                        "reason": "task has no non-empty render region",
                    }
                )
                continue
            image_keys: list[str] = []
            first_size = (0, 0)
            for segment_index, region in enumerate(regions):
                key = object_key(track, source_hash, task.external_id, segment_index)
                image_keys.append(key)
                if render_images:
                    size = _render_region(
                        document[region.page_index],
                        region.clip,
                        image_root / key,
                        dpi,
                    )
                else:
                    size = (
                        max(1, int(round(region.clip.width * dpi / 72))),
                        max(1, int(round(region.clip.height * dpi / 72))),
                    )
                if not first_size or first_size == (0, 0):
                    first_size = size
                image_count += 1
            statement = text_in_regions(document, regions)
            answer = extract_answer(document, reader, task.external_id, answer_page_cache)
            question_number = _question_number(task.external_id)
            needs_auto_answer = not (
                track == "ege_profile" and 14 <= question_number <= 20
            )
            if needs_auto_answer and not answer:
                missing_extracted_answers.append(task.external_id)
            if f"ans::{task.external_id}" in reader.named_destinations:
                tasks_with_answers += 1
            else:
                missing_answers.append(task.external_id)
            page_start = min(region.page_index for region in regions) + 1
            page_end = max(region.page_index for region in regions) + 1
            catalog_tasks.append(
                catalog_task(
                    source_task_id=task.external_id,
                    track=track,
                    statement=statement,
                    answer=answer,
                    image_keys=image_keys,
                    page_start=page_start,
                    page_end=page_end,
                    image_size=first_size,
                )
            )
        expected = 7616 if track == "ege_base" else 1869
        eligible = sum(
            1
            for task in catalog_tasks
            if not task.get("metadata", {}).get("isLegacy", False)
        )
        payload: dict[str, Any] = {
            "schemaVersion": 1,
            "examTrack": track,
            "year": int(year),
            "version": version or f"{year}.1-{source_hash[:12]}",
            "title": f"{TRACK_TITLES[track]} · банк MathStart",
            "sourceKind": "imported",
            "metadata": {
                "importerVersion": IMPORTER_VERSION,
                "source": {
                    "filename": source_path.name,
                    "sha256": source_hash,
                    "pageCount": len(reader.pages),
                    "attribution": f"предоставленный пользователем PDF: {source_path.name}",
                    "permissionProvenance": permission_provenance,
                },
                "validationSummary": {
                    "pairedImportedTasks": len(catalog_tasks),
                    "eligibleCurrentTasks": eligible,
                    "questionFamilyCount": len({
                        task["metadata"]["examQuestionNumber"]
                        for task in catalog_tasks
                        if not task["metadata"].get("isLegacy", False)
                    }),
                    "malformedTaskAnchors": len(malformed),
                    "tasksWithAnswerDestinations": tasks_with_answers,
                    "tasksWithoutAnswerDestinations": len(missing_answers),
                    "tasksWithoutExtractedAnswers": len(missing_extracted_answers),
                    "imageCount": image_count,
                },
            },
            "topics": topics,
            "tasks": catalog_tasks,
        }
        report: dict[str, Any] = {
            "schemaVersion": 1,
            "importerVersion": IMPORTER_VERSION,
            "track": track,
            "source": {
                "filename": source_path.name,
                "sha256": source_hash,
                "pageCount": len(reader.pages),
                "permissionProvenance": permission_provenance,
            },
            "expectedTaskCount": expected,
            "pairedImportedTaskCount": len(catalog_tasks),
            "eligibleCurrentTaskCount": eligible,
            "taskCountMatchesExpected": len(catalog_tasks) == expected,
            "malformedTaskAnchors": malformed,
            "answerDestinationCount": len(answer_destinations),
            "tasksWithAnswerDestinations": tasks_with_answers,
            "tasksWithoutAnswerDestinations": missing_answers,
            "tasksWithoutExtractedAnswers": missing_extracted_answers,
            "imageCount": image_count,
            "renderedImages": render_images,
            "status": "ok"
            if len(catalog_tasks) == expected
            and not missing_answers
            and not missing_extracted_answers
            else "review",
        }
        _write_json(output / f"{track}.json", payload)
        _write_json(output / f"{track}.validation.json", report)
        return payload, report
    finally:
        document.close()


def _parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_pdf", type=Path)
    parser.add_argument("--track", required=True, choices=sorted(TRACK_TITLES))
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--year", type=int, default=DEFAULT_YEAR)
    parser.add_argument("--version")
    parser.add_argument("--dpi", type=int, default=144)
    parser.add_argument("--ghostscript", help="accepted for bundle compatibility; PyMuPDF performs rendering")
    parser.add_argument("--permission-provenance", default="user-confirmed source permission")
    parser.add_argument("--dry-run", action="store_true", help="write catalog/report but skip WebP rendering")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = _parse_args(argv)
    _, report = build_import(
        args.input_pdf,
        args.track,
        args.output_dir,
        year=args.year,
        version=args.version,
        dpi=args.dpi,
        render_images=not args.dry_run,
        permission_provenance=args.permission_provenance,
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["status"] == "ok" else 2


if __name__ == "__main__":
    raise SystemExit(main())
