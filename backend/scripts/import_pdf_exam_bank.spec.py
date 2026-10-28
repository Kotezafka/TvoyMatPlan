#!/usr/bin/env python3
"""Focused tests for the repeatable PDF exam-bank importer."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
import sys

import pymupdf
from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    ArrayObject,
    FloatObject,
    NameObject,
    NullObject,
    TextStringObject,
)

sys.path.insert(0, str(Path(__file__).resolve().parent))
import import_pdf_exam_bank as importer


def make_fixture(path: Path) -> None:
    doc = pymupdf.open()
    font = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

    def add_text(page, point, text):
        page.insert_text(point, text, fontname="dejavu", fontfile=font)

    first = doc.new_page(width=595.276, height=841.89)
    add_text(first, (60, 100), "Задача 1.1. Найдите значение выражения.")
    add_text(first, (60, 130), "Продолжение первого задания.")
    add_text(first, (60, 400), "Задача 1.2. Найдите площадь фигуры.")
    first.draw_rect(pymupdf.Rect(100, 430, 220, 500), color=(0, 0, 0))
    add_text(first, (60, 755), "Продолжение задания 1.2 на следующей странице.")
    second = doc.new_page(width=595.276, height=841.89)
    add_text(second, (60, 100), "Продолжение задания 1.2.")
    add_text(second, (60, 220), "Задача 1.3. Решите уравнение.")
    answers = doc.new_page(width=595.276, height=841.89)
    add_text(answers, (80, 200), "№1.1")
    add_text(answers, (135, 200), "12,5.")
    add_text(answers, (240, 200), "№1.2")
    add_text(answers, (299, 200), "−3.")
    add_text(answers, (400, 200), "№1.3")
    add_text(answers, (463, 200), "7.")
    doc.save(path)
    doc.close()

    source = PdfReader(path)
    writer = PdfWriter(clone_from=source)
    page_refs = [writer.get_reference(page) for page in writer.pages]
    for name, page_index, left, top, fit in [
        ("task::1.1", 0, 63.779, 741.89, "/XYZ"),
        ("task::1.2", 0, 63.779, 441.89, "/XYZ"),
        ("task::1.3", 1, 63.779, 641.89, "/XYZ"),
        ("ans::1.1", 2, 63.779, 641.89, "/XYZ"),
        ("ans::1.2", 2, 222.0, 641.89, "/XYZ"),
        ("ans::1.3", 2, 383.0, 641.89, "/XYZ"),
    ]:
        destination = ArrayObject(
            [
                page_refs[page_index],
                NameObject(fit),
                FloatObject(left),
                FloatObject(top),
                NullObject(),
            ]
        )
        writer.add_named_destination_array(TextStringObject(name), destination)
    with path.open("wb") as stream:
        writer.write(stream)


class PdfExamBankImporterTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.pdf_path = Path(self.temp_dir.name) / "fixture.pdf"
        make_fixture(self.pdf_path)

    def test_discovers_task_ids_and_clips_same_page_task_before_next_anchor(self):
        pdf = pymupdf.open(self.pdf_path)
        reader = PdfReader(self.pdf_path)
        tasks, malformed = importer.discover_tasks(reader, "ege_base")

        self.assertEqual([task.external_id for task in tasks], ["1.1", "1.2", "1.3"])
        self.assertEqual(malformed, [])
        task = tasks[0]
        regions = importer.task_regions(task, tasks, pdf)
        self.assertEqual(len(regions), 1)
        self.assertEqual(regions[0].page_index, 0)
        self.assertLess(regions[0].clip.y1, 400)
        self.assertIn("Задача 1.1", importer.text_in_regions(pdf, regions))
        self.assertNotIn("Задача 1.2", importer.text_in_regions(pdf, regions))
        pdf.close()

    def test_splits_a_task_that_continues_across_pages(self):
        pdf = pymupdf.open(self.pdf_path)
        reader = PdfReader(self.pdf_path)
        tasks, _ = importer.discover_tasks(reader, "ege_base")
        regions = importer.task_regions(tasks[1], tasks, pdf)

        self.assertEqual([region.page_index for region in regions], [0, 1])
        self.assertIn("Продолжение задания 1.2", importer.text_in_regions(pdf, regions))
        self.assertNotIn("Задача 1.3", importer.text_in_regions(pdf, regions))
        pdf.close()

    def test_maps_answer_from_matching_named_destination_row(self):
        pdf = pymupdf.open(self.pdf_path)
        reader = PdfReader(self.pdf_path)
        self.assertEqual(importer.extract_answer(pdf, reader, "1.1"), ["12,5"])
        self.assertEqual(importer.extract_answer(pdf, reader, "1.2"), ["-3"])
        pdf.close()

    def test_object_key_is_stable_and_uses_string_task_id(self):
        digest = "a" * 64
        expected = (
            "curriculum/assets/mathstart/ege_profile/"
            f"{digest}/1.2.10/0.webp"
        )
        self.assertEqual(importer.object_key("ege_profile", digest, "1.2.10", 0), expected)
        self.assertEqual(importer.object_key("ege_profile", digest, "1.2.10", 0), expected)

    def test_catalog_metadata_classifies_profile_part_and_legacy_question(self):
        task = importer.catalog_task(
            source_task_id="21.3.2",
            track="ege_profile",
            statement="Решите задачу",
            answer=["4"],
            image_keys=["one.webp"],
            page_start=10,
            page_end=11,
            image_size=(800, 600),
            importer_version="test",
        )
        self.assertEqual(task["metadata"]["examQuestionNumber"], 21)
        self.assertIs(task["metadata"]["isLegacy"], True)
        self.assertEqual(task["topicCode"], "Q21")
        part_two = importer.catalog_task(
            source_task_id="14.2",
            track="ege_profile",
            statement="Решите уравнение",
            answer=["2"],
            image_keys=["two.webp"],
            page_start=1,
            page_end=1,
            image_size=(800, 600),
            importer_version="test",
        )
        self.assertEqual(part_two["metadata"]["examPart"], 2)
        self.assertEqual(part_two["acceptedAnswers"], [])
        part_one = importer.catalog_task(
            source_task_id="13.3",
            track="ege_profile",
            statement="Решите задачу",
            answer=["2"],
            image_keys=["three.webp"],
            page_start=1,
            page_end=1,
            image_size=(800, 600),
            importer_version="test",
        )
        self.assertEqual(part_one["metadata"]["examPart"], 1)


if __name__ == "__main__":
    unittest.main()
