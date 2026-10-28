#!/usr/bin/env python3
"""Create the committed, offline training bank from the pinned DeepMind generator.

Requires Python 3 with numpy, six, sympy and absl-py. The application itself
does not need Python or network access; it reads the generated JSON at startup.
"""

from __future__ import annotations

import io
import json
import random
import re
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/curriculum/fixtures/deepmind-math.v1.ts"
REVISION = "427f45075f84b8b9774950196ad63867ca20ffb3"
REPOSITORY = "https://github.com/google-deepmind/mathematics_dataset"
ARCHIVE = f"https://codeload.github.com/google-deepmind/mathematics_dataset/zip/{REVISION}"
YEAR = 2026
VERSION = "2026.1"

TRACKS = [
    ("oge", "ОГЭ по математике", 81001),
    ("ege_base", "ЕГЭ по математике · базовый уровень", 81002),
    ("ege_profile", "ЕГЭ по математике · профильный уровень", 81003),
]

TOPICS = [
    ("DM-ARITH", "Арифметические вычисления", "Числа и вычисления", 1),
    ("DM-MULT", "Умножение чисел", "Числа и вычисления", 2),
    ("DM-LINEAR", "Линейные уравнения", "Алгебра", 3),
    ("DM-SYSTEM", "Системы линейных уравнений", "Алгебра", 4),
    ("DM-SEQUENCE", "Последовательности", "Алгебра", 5),
    ("DM-GCD", "Делимость и общий делитель", "Числа и вычисления", 6),
    ("DM-PLACE", "Разряды числа", "Числа и вычисления", 7),
    ("DM-REMAINDER", "Деление с остатком", "Числа и вычисления", 8),
]

GENERATORS = [
    ("DM-ARITH", "arithmetic", "add_or_sub", 20, "standard"),
    ("DM-MULT", "arithmetic", "mul", 10, "standard"),
    ("DM-LINEAR", "algebra", "linear_1d", 20, "standard"),
    ("DM-SYSTEM", "algebra", "linear_2d", 10, "advanced"),
    ("DM-SEQUENCE", "algebra", "sequence_next_term", 10, "standard"),
    ("DM-GCD", "numbers", "gcd", 10, "standard"),
    ("DM-PLACE", "numbers", "place_value", 10, "basic"),
    ("DM-REMAINDER", "numbers", "div_remainder", 10, "basic"),
]

PLACE_NAMES = {
    "units": "единиц",
    "ones": "единиц",
    "tens": "десятков",
    "hundreds": "сотен",
    "thousands": "тысяч",
    "ten thousands": "десятков тысяч",
    "hundred thousands": "сотен тысяч",
    "millions": "миллионов",
    "ten millions": "десятков миллионов",
    "hundred millions": "сотен миллионов",
    "billions": "миллиардов",
}


def display_math(text: str) -> str:
    return re.sub(r"(?<=\d)\.(?=\d)", ",", text.replace("**", "^").replace("*", "×"))


def translate(category: str, module_name: str, question: str) -> str | None:
    text = question.strip()
    if category == "algebra" and module_name == "linear_1d":
        match = re.fullmatch(r"Solve (.+) for ([a-z])\.", text)
        if match and "=" in match.group(1):
            return display_math(f"Решите уравнение: {match.group(1)}. Найдите {match.group(2)}.")
    if category == "algebra" and module_name == "linear_2d":
        match = re.fullmatch(r"Solve (.+), (.+) for ([a-z])\.", text)
        if match:
            return display_math(
                f"Решите систему уравнений: {match.group(1)}; "
                f"{match.group(2)}. Найдите {match.group(3)}."
            )
    if category == "algebra" and module_name == "sequence_next_term":
        match = re.fullmatch(r"What is the next term in (.+)\?", text)
        if not match:
            match = re.fullmatch(r"What comes next: (.+)\?", text)
        if match:
            return display_math(f"Найдите следующий член последовательности: {match.group(1)}.")
    if category == "numbers" and module_name == "gcd":
        match = re.fullmatch(
            r"(?:What is|Calculate) the (?:greatest common divisor|highest common divisor|highest common factor|greatest common factor) of (.+) and (.+)\?*\.?",
            text,
        )
        if match:
            return display_math(f"Найдите наибольший общий делитель чисел {match.group(1)} и {match.group(2)}.")
    if category == "numbers" and module_name == "place_value":
        match = re.fullmatch(r"What is the (.+) digit of (.+)\?", text)
        if match and match.group(1) in PLACE_NAMES:
            return display_math(f"Назовите цифру {PLACE_NAMES[match.group(1)]} в числе {match.group(2)}.")
    if category == "numbers" and module_name == "div_remainder":
        match = re.fullmatch(r"What is the remainder when (.+) is divided by (.+)\?", text)
        if match:
            return display_math(f"Найдите остаток от деления {match.group(1)} на {match.group(2)}.")
    if category == "arithmetic" and module_name == "add_or_sub":
        match = re.fullmatch(r"What is the difference between (.+) and (.+)\?", text)
        if match:
            return display_math(f"Найдите разность чисел {match.group(1)} и {match.group(2)}.")
        match = re.fullmatch(r"Subtract (.+) from (.+)\.?", text)
        if match:
            return display_math(f"Вычислите разность: {match.group(2)} − ({match.group(1)}).")
        match = re.fullmatch(r"What is (.+) take away (.+)\?", text)
        if match:
            return display_math(f"Вычислите: {match.group(1)} − ({match.group(2)}).")
        match = re.fullmatch(r"What is (.+) plus (.+)\?", text)
        if match:
            return display_math(f"Вычислите: {match.group(1)} + ({match.group(2)}).")
        match = re.fullmatch(r"What is (.+) minus (.+)\?", text)
        if match:
            return display_math(f"Вычислите: {match.group(1)} − ({match.group(2)}).")
        match = re.fullmatch(r"Calculate (.+)\.?", text)
        if match:
            return display_math(f"Вычислите: {match.group(1)}.")
        if re.fullmatch(r"[-+0-9. ]+[+\-*/][+\-*/0-9. ]+", text):
            return display_math(f"Вычислите: {text}.")
    if category == "arithmetic" and module_name == "mul":
        match = re.fullmatch(r"Product of (.+) and (.+)\.?", text)
        if match:
            return display_math(f"Найдите произведение чисел {match.group(1)} и {match.group(2)}.")
        match = re.fullmatch(r"Calculate (.+)\.?", text)
        if match:
            return display_math(f"Вычислите: {match.group(1)}.")
        if re.fullmatch(r"[-+0-9.* ]+", text):
            return display_math(f"Вычислите: {text}.")
    return None


def answer_list(value: str) -> list[str] | None:
    # The current answer matcher supports decimal and integer numeric answers.
    # Exclude fractions, symbolic expressions, and scientific notation rather
    # than silently storing items that the student page cannot auto-grade.
    if not re.fullmatch(r"-?\d+(?:\.\d+)?", value.strip()):
        return None
    return [value.strip()]


def entropy_for(level: str):
    bounds = {"basic": (0, 0.34), "standard": (0.33, 0.68), "advanced": (0.66, 1)}[level]

    def restrict(value):
        low, high = value
        width = high - low
        return (low + bounds[0] * width, low + bounds[1] * width)

    return restrict


def make_bank():
    try:
        from mathematics_dataset.modules import modules
    except ImportError as error:
        raise SystemExit(
            "Install the pinned Mathematics Dataset package dependencies first: "
            "numpy, six, sympy and absl-py."
        ) from error

    releases = []
    for track, track_title, seed in TRACKS:
        random.seed(seed)
        np.random.seed(seed)
        topic_values = [
            {
                "code": code,
                "title": title,
                "section": section,
                "aliases": [],
                "position": position,
            }
            for code, title, section, position in TOPICS
        ]
        tasks = []
        for topic_code, category, module_name, count, difficulty in GENERATORS:
            generator = modules.train(entropy_for(difficulty))[category][module_name]
            generated = 0
            attempts = 0
            while generated < count and attempts < count * 30:
                attempts += 1
                sample = generator()
                statement = translate(category, module_name, str(sample.question))
                answers = answer_list(str(sample.answer))
                if not statement or not answers or len(statement) > 600:
                    continue
                generated += 1
                tasks.append(
                    {
                        "externalId": f"DM-{track.upper()}-{topic_code}-{generated:03d}",
                        "topicCode": topic_code,
                        "taskType": module_name,
                        "difficulty": difficulty,
                        "statement": statement,
                        "acceptedAnswers": answers,
                        "sourceUrl": REPOSITORY,
                        "metadata": {
                            "synthetic": True,
                            "dataset": "DeepMind Mathematics Dataset",
                            "generatorModule": f"{category}.{module_name}",
                            "sourceRevision": REVISION,
                            "license": "Apache-2.0",
                            "attribution": "DeepMind Technologies Limited",
                        },
                    }
                )
            if generated != count:
                raise RuntimeError(
                    f"Generated only {generated}/{count} valid tasks for {category}.{module_name}"
                )
        random.shuffle(tasks)
        releases.append(
            {
                "schemaVersion": 1,
                "examTrack": track,
                "year": YEAR,
                "version": VERSION,
                "title": f"Учебный банк математики · {track_title} · синтетические задания",
                "sourceKind": "imported",
                "metadata": {
                    "dataset": "DeepMind Mathematics Dataset",
                    "datasetVersion": "1.0.1",
                    "sourceUrl": REPOSITORY,
                    "sourceRevision": REVISION,
                    "paperUrl": "https://openreview.net/pdf?id=H1gR5iR5FX",
                    "license": "Apache-2.0",
                    "attribution": "DeepMind Technologies Limited",
                    "generatedQuestions": True,
                    "disclaimer": (
                        "Учебный банк из синтетических задач; не является официальным "
                        "КИМ ОГЭ/ЕГЭ и не гарантирует соответствие спецификации экзамена."
                    ),
                },
                "topics": topic_values,
                "tasks": tasks,
            }
        )
    return releases


def main():
    request = urllib.request.Request(ARCHIVE, headers={"User-Agent": "EasyPhys bank builder"})
    archive = urllib.request.urlopen(request, timeout=60).read()
    with tempfile.TemporaryDirectory(prefix="easyphys-deepmind-") as temp:
        root = Path(temp)
        zipfile.ZipFile(io.BytesIO(archive)).extractall(root)
        package = next(root.glob("mathematics_dataset-*"))
        sys.path.insert(0, str(package))
        releases = make_bank()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    source = (
        "import { CurriculumImportPayload } from '../curriculum.types';\n\n"
        "// Generated offline from the pinned Apache-2.0 DeepMind dataset generator.\n"
        "const CURRICULA = "
        + json.dumps(releases, ensure_ascii=False, indent=2)
        + " as CurriculumImportPayload[];\n\n"
        + "export function buildDeepMindCurricula(): CurriculumImportPayload[] {\n"
        + "  return CURRICULA;\n"
        + "}\n"
    )
    OUTPUT.write_text(source, encoding="utf-8")
    print(f"Wrote {sum(len(release['tasks']) for release in releases)} tasks to {OUTPUT}")


if __name__ == "__main__":
    main()
