import { CurriculumImportPayload } from '../curriculum.types';

// Generated offline from the pinned Apache-2.0 DeepMind dataset generator.
const CURRICULA = [
  {
    "schemaVersion": 1,
    "examTrack": "oge",
    "year": 2026,
    "version": "2026.1",
    "title": "Учебный банк математики · ОГЭ по математике · синтетические задания",
    "sourceKind": "imported",
    "metadata": {
      "dataset": "DeepMind Mathematics Dataset",
      "datasetVersion": "1.0.1",
      "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
      "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
      "paperUrl": "https://openreview.net/pdf?id=H1gR5iR5FX",
      "license": "Apache-2.0",
      "attribution": "DeepMind Technologies Limited",
      "generatedQuestions": true,
      "disclaimer": "Учебный банк из синтетических задач; не является официальным КИМ ОГЭ/ЕГЭ и не гарантирует соответствие спецификации экзамена."
    },
    "topics": [
      {
        "code": "DM-ARITH",
        "title": "Арифметические вычисления",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 1
      },
      {
        "code": "DM-MULT",
        "title": "Умножение чисел",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 2
      },
      {
        "code": "DM-LINEAR",
        "title": "Линейные уравнения",
        "section": "Алгебра",
        "aliases": [],
        "position": 3
      },
      {
        "code": "DM-SYSTEM",
        "title": "Системы линейных уравнений",
        "section": "Алгебра",
        "aliases": [],
        "position": 4
      },
      {
        "code": "DM-SEQUENCE",
        "title": "Последовательности",
        "section": "Алгебра",
        "aliases": [],
        "position": 5
      },
      {
        "code": "DM-GCD",
        "title": "Делимость и общий делитель",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 6
      },
      {
        "code": "DM-PLACE",
        "title": "Разряды числа",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 7
      },
      {
        "code": "DM-REMAINDER",
        "title": "Деление с остатком",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 8
      }
    ],
    "tasks": [
      {
        "externalId": "DM-OGE-DM-PLACE-008",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 16934.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-002",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 1×1,61.",
        "acceptedAnswers": [
          "1.61"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-017",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -261 - 379 = -80×l. Найдите l.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-009",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -0,39 + (3085355).",
        "acceptedAnswers": [
          "3085354.61"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-003",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 49.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-008",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 65 на 10.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-005",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел 0,8 и -3912..",
        "acceptedAnswers": [
          "-3129.6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-019",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: -4350,88. − (-155049).",
        "acceptedAnswers": [
          "150698.12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-010",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 0,1 × 52,0999.",
        "acceptedAnswers": [
          "5.20999"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-008",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -68×h - 14150 = 498×h. Найдите h.",
        "acceptedAnswers": [
          "-25"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-007",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = 436×s - 120 - 120 + 240. Найдите s.",
        "acceptedAnswers": [
          "0"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-006",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 4×q - 7×r = -41; -5085×r + 5090×r - 19 = 2×q. Найдите q.",
        "acceptedAnswers": [
          "-12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-009",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -2×672,1..",
        "acceptedAnswers": [
          "-1344.2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-020",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел 11,3 и -0,71646.",
        "acceptedAnswers": [
          "12.01646"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-010",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 2650 = 11×s + 2496. Найдите s.",
        "acceptedAnswers": [
          "14"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-007",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -480 × -6,8.",
        "acceptedAnswers": [
          "3264"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-009",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 652×w + 1012 = 17964. Найдите w.",
        "acceptedAnswers": [
          "26"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-011",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 0,126258919809+-0,1.",
        "acceptedAnswers": [
          "0.026258919809"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-005",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -246×f - 2211 = 593 + 886. Найдите f.",
        "acceptedAnswers": [
          "-15"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-007",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 14144.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-004",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 6574, 6510, 6404, 6256, 6066, 5834, 5560.",
        "acceptedAnswers": [
          "5244"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-005",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -2×l - 901 + 479 = -2×i - 458; -7×l + 136 = 3×i. Найдите i.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-009",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков тысяч в числе 30710.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-008",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 33349 − (218492,2).",
        "acceptedAnswers": [
          "-185143.2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-001",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: b - 22 = 5×i; -2693×b + 891×b + 905×b + 14 = -i - 898×b. Найдите i.",
        "acceptedAnswers": [
          "-6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-004",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру сотен в числе 12851.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-010",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру сотен в числе 103757.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-017",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: -1. − (0,007098853).",
        "acceptedAnswers": [
          "-1.007098853"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-018",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: -61370524. − (-0,07).",
        "acceptedAnswers": [
          "-61370523.93"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-001",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 1848 на 17.",
        "acceptedAnswers": [
          "12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-001",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 111 и 1458?.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-013",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -27,7703 - -0,789.",
        "acceptedAnswers": [
          "-26.9813"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-003",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 857527 и 11..",
        "acceptedAnswers": [
          "11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-016",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел -1716,843 и -12,8.",
        "acceptedAnswers": [
          "1704.043"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-004",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 101961 и 72?.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-010",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -9008 - -54809..",
        "acceptedAnswers": [
          "45801"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-015",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 87×c = -53×c - 4×c - 3312. Найдите c.",
        "acceptedAnswers": [
          "-23"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-002",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 915 на 75.",
        "acceptedAnswers": [
          "15"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-002",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 52×q + 11 = 97×q - 56×q. Найдите q.",
        "acceptedAnswers": [
          "-1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-010",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 0 = -8×r - 3×n + 403; -4×r + 517×n - 518×n = -201. Найдите r.",
        "acceptedAnswers": [
          "50"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-008",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 518988 и 732..",
        "acceptedAnswers": [
          "732"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-004",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 5×p - 5 = -4×x; 3×x + 3×p - 330 = -324. Найдите x.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-013",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = 10×n - 12195 + 12095. Найдите n.",
        "acceptedAnswers": [
          "10"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-005",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 126 и 48531?.",
        "acceptedAnswers": [
          "21"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-002",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 53×r = -318; -4×s - 10 = -5×r - 24 + 4 - 22 - 10. Найдите s.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-014",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 76 = -53×l + 373 + 127. Найдите l.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-001",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 1,1617×-29.",
        "acceptedAnswers": [
          "-33.6893"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-006",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 1067 - 87 + 2020 = 200×f. Найдите f.",
        "acceptedAnswers": [
          "15"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-020",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = -38×f + 443 - 671. Найдите f.",
        "acceptedAnswers": [
          "-6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-005",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -1185748, -1185750, -1185752, -1185754, -1185756.",
        "acceptedAnswers": [
          "-1185758"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-008",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -10591, -21193, -31795, -42397, -52999, -63601.",
        "acceptedAnswers": [
          "-74203"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-003",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 139×x - 633 = -7×x + 243. Найдите x.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-003",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 0×c - 108 = 3×y + 9×c; -242×y + 502×y = 261×y - 4×c + 36. Найдите y.",
        "acceptedAnswers": [
          "-36"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-007",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел 3 и 245125381.",
        "acceptedAnswers": [
          "245125378"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-005",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 540 на 137.",
        "acceptedAnswers": [
          "129"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-004",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 18 - 265566..",
        "acceptedAnswers": [
          "-265548"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-010",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 202 на 69.",
        "acceptedAnswers": [
          "64"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-008",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 0,12×1346,6.",
        "acceptedAnswers": [
          "161.592"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-007",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -160×x + 150×x = 6×d - 398; 3×x + 246 = 4×d. Найдите x.",
        "acceptedAnswers": [
          "2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-012",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 1001052 - 23203.",
        "acceptedAnswers": [
          "977849"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-006",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 5+-2119,9328.",
        "acceptedAnswers": [
          "-2114.9328"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-015",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -14,9 - -242003..",
        "acceptedAnswers": [
          "241988.1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-005",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -52,1 - -142016..",
        "acceptedAnswers": [
          "141963.9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-003",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -45, -312, -755, -1374.",
        "acceptedAnswers": [
          "-2169"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-002",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -8 - 834,00335..",
        "acceptedAnswers": [
          "-842.00335"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-001",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 11×a - 47 = -14. Найдите a.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-001",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 2750.",
        "acceptedAnswers": [
          "2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-001",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: -564,77. − (12898).",
        "acceptedAnswers": [
          "-13462.77"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-009",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -8, -96, -162, -194, -180.",
        "acceptedAnswers": [
          "-108"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-014",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: 123. − (-9,12732).",
        "acceptedAnswers": [
          "132.12732"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-010",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 456 и 972078..",
        "acceptedAnswers": [
          "114"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-009",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 133 на 56.",
        "acceptedAnswers": [
          "21"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-007",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 1215 и 510..",
        "acceptedAnswers": [
          "15"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-004",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 228 на 64.",
        "acceptedAnswers": [
          "36"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-007",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 29394, 29467, 29540, 29613, 29686, 29759.",
        "acceptedAnswers": [
          "29832"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-003",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 587 на 35.",
        "acceptedAnswers": [
          "27"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-006",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру единиц в числе 82659.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-006",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 221608, 221605, 221602.",
        "acceptedAnswers": [
          "221599"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-002",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 5218734 и 18?.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-002",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 2900, 5779, 8640, 11483.",
        "acceptedAnswers": [
          "14308"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-006",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 196950 и 1650..",
        "acceptedAnswers": [
          "150"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-004",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -1,13×8,8.",
        "acceptedAnswers": [
          "-9.944"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-ARITH-003",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 0,1 - 28346513..",
        "acceptedAnswers": [
          "-28346512.9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-006",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 1093 на 42.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-019",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -16156 = -244×t - 333×t. Найдите t.",
        "acceptedAnswers": [
          "28"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-009",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 2×j + 0×j - 278 + 270 = s; 12 = 3×j + 5×s. Найдите j.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-002",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 5243.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-004",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 91 = -54×j - 28×j - 237. Найдите j.",
        "acceptedAnswers": [
          "-4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-010",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -29702, -29713, -29724, -29735.",
        "acceptedAnswers": [
          "-29746"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-GCD-009",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 55 и 5961131..",
        "acceptedAnswers": [
          "11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-PLACE-005",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 36649.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-REMAINDER-007",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 348 на 10.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-003",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел -5 и -40737..",
        "acceptedAnswers": [
          "203685"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-016",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -58×t - 488 = -5×t - 170. Найдите t.",
        "acceptedAnswers": [
          "-6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SYSTEM-008",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -t - 10×x + 1634 - 1638 = 0; 4×t = -5×x - 16. Найдите t.",
        "acceptedAnswers": [
          "-4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-011",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -346×q = 828 + 1940. Найдите q.",
        "acceptedAnswers": [
          "-8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-MULT-006",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел -391,13 и -3..",
        "acceptedAnswers": [
          "1173.39"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-012",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: s = 15×s + 12 + 100. Найдите s.",
        "acceptedAnswers": [
          "-8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-LINEAR-018",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = -549×i + 560×i - 143. Найдите i.",
        "acceptedAnswers": [
          "13"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-OGE-DM-SEQUENCE-001",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 7237, 14462, 21673, 28864, 36029, 43162.",
        "acceptedAnswers": [
          "50257"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      }
    ]
  },
  {
    "schemaVersion": 1,
    "examTrack": "ege_base",
    "year": 2026,
    "version": "2026.1",
    "title": "Учебный банк математики · ЕГЭ по математике · базовый уровень · синтетические задания",
    "sourceKind": "imported",
    "metadata": {
      "dataset": "DeepMind Mathematics Dataset",
      "datasetVersion": "1.0.1",
      "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
      "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
      "paperUrl": "https://openreview.net/pdf?id=H1gR5iR5FX",
      "license": "Apache-2.0",
      "attribution": "DeepMind Technologies Limited",
      "generatedQuestions": true,
      "disclaimer": "Учебный банк из синтетических задач; не является официальным КИМ ОГЭ/ЕГЭ и не гарантирует соответствие спецификации экзамена."
    },
    "topics": [
      {
        "code": "DM-ARITH",
        "title": "Арифметические вычисления",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 1
      },
      {
        "code": "DM-MULT",
        "title": "Умножение чисел",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 2
      },
      {
        "code": "DM-LINEAR",
        "title": "Линейные уравнения",
        "section": "Алгебра",
        "aliases": [],
        "position": 3
      },
      {
        "code": "DM-SYSTEM",
        "title": "Системы линейных уравнений",
        "section": "Алгебра",
        "aliases": [],
        "position": 4
      },
      {
        "code": "DM-SEQUENCE",
        "title": "Последовательности",
        "section": "Алгебра",
        "aliases": [],
        "position": 5
      },
      {
        "code": "DM-GCD",
        "title": "Делимость и общий делитель",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 6
      },
      {
        "code": "DM-PLACE",
        "title": "Разряды числа",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 7
      },
      {
        "code": "DM-REMAINDER",
        "title": "Деление с остатком",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 8
      }
    ],
    "tasks": [
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-009",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -21411, -42822, -64229, -85632.",
        "acceptedAnswers": [
          "-107031"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-005",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 7918 и 2368..",
        "acceptedAnswers": [
          "74"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-003",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -24×d - 183 + 38 + 1 = 0. Найдите d.",
        "acceptedAnswers": [
          "-6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-005",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 5×k + 55 = -i - 28; 0 = 3×k - i + 53. Найдите k.",
        "acceptedAnswers": [
          "-17"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-001",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -12029×x = -12033×x - 28. Найдите x.",
        "acceptedAnswers": [
          "-7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-016",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 0,07 − (861540357).",
        "acceptedAnswers": [
          "-861540356.93"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-007",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел -22 и -583998.",
        "acceptedAnswers": [
          "583976"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-008",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру единиц в числе 3497.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-013",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 2418067 - 0,05.",
        "acceptedAnswers": [
          "2418066.95"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-002",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -4376876122 + (3).",
        "acceptedAnswers": [
          "-4376876119"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-002",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 200 и 1450?.",
        "acceptedAnswers": [
          "50"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-003",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру сотен в числе 849.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-002",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 1937×k - 77457 - 5834 = 0. Найдите k.",
        "acceptedAnswers": [
          "43"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-006",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 355 на 58.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-008",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 97804 и 168?.",
        "acceptedAnswers": [
          "28"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-004",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -42105, -42104, -42101, -42096, -42089, -42080, -42069.",
        "acceptedAnswers": [
          "-42056"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-006",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 398×x - 393×x - 3×r + 42 = 0; 0×r + 2×r + 4 = -2×x. Найдите x.",
        "acceptedAnswers": [
          "-6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-015",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -0,0776758 − (-12991).",
        "acceptedAnswers": [
          "12990.9223242"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-006",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -91×s + 75×s + 70×s = -162. Найдите s.",
        "acceptedAnswers": [
          "-3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-004",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 235872 и 1911..",
        "acceptedAnswers": [
          "273"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-004",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -0,0578 + -83646..",
        "acceptedAnswers": [
          "-83646.0578"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-017",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 72 = -234×p + 243×p. Найдите p.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-001",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -11401, -11399, -11395, -11389.",
        "acceptedAnswers": [
          "-11381"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-007",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел -376574 и -0,4..",
        "acceptedAnswers": [
          "150629.6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-003",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 34×x - 34 = 2×i; -2×i = 15×x - 21×x + 7×x - 36. Найдите i.",
        "acceptedAnswers": [
          "17"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-004",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 0,3 × -0,82.",
        "acceptedAnswers": [
          "-0.246"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-007",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 0×j + 0×j + 4×j = -5×j + m + 77; 1 = j - 2×m. Найдите j.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-002",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 24590.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-002",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел -1,0693 и 12..",
        "acceptedAnswers": [
          "-12.8316"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-002",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 86 на 28.",
        "acceptedAnswers": [
          "2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-008",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = 62×w - 4×w - 2234 + 2930. Найдите w.",
        "acceptedAnswers": [
          "-12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-005",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -15×s - 1588 + 1363 = 0. Найдите s.",
        "acceptedAnswers": [
          "-15"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-005",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -8×1786.",
        "acceptedAnswers": [
          "-14288"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-001",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 2577.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-005",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 56846,64+-33,6.",
        "acceptedAnswers": [
          "56813.04"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-011",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -118×o - 2464 = -475×o + 6461. Найдите o.",
        "acceptedAnswers": [
          "25"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-019",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -283×b + 286×b = 3. Найдите b.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-010",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -113 − (-7,8371337).",
        "acceptedAnswers": [
          "-105.1628663"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-002",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -3×l - 4 = -g; -2×g + 4×l - 18137 = -18145. Найдите g.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-018",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 29×v - 127 - 6 + 452 = 0. Найдите v.",
        "acceptedAnswers": [
          "-11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-018",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 294,64+1084880.",
        "acceptedAnswers": [
          "1085174.64"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-009",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 263 на 50.",
        "acceptedAnswers": [
          "13"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-010",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру сотен в числе 981.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-008",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 0 = 2×f - 2×l + 2; 45172×l + 8 = -2×f + 45177×l. Найдите f.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-007",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру сотен тысяч в числе 109571.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-010",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -12×w = -35×p + 40×p - 15×w + 28; 28 = p + 5×w. Найдите p.",
        "acceptedAnswers": [
          "-2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-010",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 355×j - 1452 = 223×j. Найдите j.",
        "acceptedAnswers": [
          "11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-001",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 36755140,86 + 1..",
        "acceptedAnswers": [
          "36755141.86"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-009",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -124 = -165×o + 78×o - 907. Найдите o.",
        "acceptedAnswers": [
          "-9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-017",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: -8,3. − (360238,274).",
        "acceptedAnswers": [
          "-360246.574"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-009",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 7 = 4×g + 4×a - 1; 5×g - 276653×a + 276655×a + 5 = 0. Найдите g.",
        "acceptedAnswers": [
          "-3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-012",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -48 = -21×y + 262 + 89. Найдите y.",
        "acceptedAnswers": [
          "19"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-010",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 158089 и 1192?.",
        "acceptedAnswers": [
          "149"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-006",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 5806, 11469, 17132, 22795, 28458, 34121.",
        "acceptedAnswers": [
          "39784"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-006",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -72270 + -99,73.",
        "acceptedAnswers": [
          "-72369.73"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-019",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 117043 + -1025..",
        "acceptedAnswers": [
          "116018"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-010",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 1293, 2596, 3897, 5196, 6493, 7788, 9081.",
        "acceptedAnswers": [
          "10372"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-006",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 18 и 3520278..",
        "acceptedAnswers": [
          "18"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-003",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 515 на 452.",
        "acceptedAnswers": [
          "63"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-014",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = 33×o - 129 + 228. Найдите o.",
        "acceptedAnswers": [
          "-3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-001",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел 63,33 и -110..",
        "acceptedAnswers": [
          "-6966.3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-003",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 0,02 × -2627.",
        "acceptedAnswers": [
          "-52.54"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-003",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 1298 и 957..",
        "acceptedAnswers": [
          "11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-007",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 592, 542, 466, 370, 260, 142, 22.",
        "acceptedAnswers": [
          "-94"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-004",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 21538.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-008",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -14 - 1706532..",
        "acceptedAnswers": [
          "-1706546"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-020",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -31×s + 109 - 388 = 0. Найдите s.",
        "acceptedAnswers": [
          "-9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-007",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -1698×k = -1746×k + 1056. Найдите k.",
        "acceptedAnswers": [
          "22"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-008",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел -22 и -277950..",
        "acceptedAnswers": [
          "6114900"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-006",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру сотен в числе 1491.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-001",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 84 и 10356?.",
        "acceptedAnswers": [
          "12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-004",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 8 на 1.",
        "acceptedAnswers": [
          "0"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-007",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 15769 и 793..",
        "acceptedAnswers": [
          "13"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-001",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 296 на 39.",
        "acceptedAnswers": [
          "23"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-016",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -2733 = -17×s - 5957 + 2714. Найдите s.",
        "acceptedAnswers": [
          "-30"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-009",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 22368×0,5..",
        "acceptedAnswers": [
          "11184"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-004",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 20925×u - 20918×u - 133 = 0. Найдите u.",
        "acceptedAnswers": [
          "19"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-007",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 89 на 24.",
        "acceptedAnswers": [
          "17"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-009",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 9699.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-008",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -52, -79, -104, -127, -148, -167, -184.",
        "acceptedAnswers": [
          "-199"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-015",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -222×g + 14194 - 12196 = 0. Найдите g.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-005",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -42718, -42701, -42672, -42631, -42578, -42513, -42436.",
        "acceptedAnswers": [
          "-42347"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-011",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 2832245 − (10,8).",
        "acceptedAnswers": [
          "2832234.2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-020",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите разность: 0. − (-25462,8936).",
        "acceptedAnswers": [
          "25462.8936"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-014",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел -0,468534 и 14621,9.",
        "acceptedAnswers": [
          "14622.368534"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-LINEAR-013",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -62×l + 125×l + 299 + 205 = 0. Найдите l.",
        "acceptedAnswers": [
          "-8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-003",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -0,05 - -37726031..",
        "acceptedAnswers": [
          "37726030.95"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-008",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 1881 на 617.",
        "acceptedAnswers": [
          "30"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-GCD-009",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 2077 и 62..",
        "acceptedAnswers": [
          "31"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-PLACE-005",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 53071.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-012",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -3117,95 - 1035.",
        "acceptedAnswers": [
          "-4152.95"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-005",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 17 на 9.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-003",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 283243, 566480, 849717, 1132954.",
        "acceptedAnswers": [
          "1416191"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-REMAINDER-010",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 238 на 48.",
        "acceptedAnswers": [
          "46"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SEQUENCE-002",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -90, -261, -432.",
        "acceptedAnswers": [
          "-603"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-010",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -4,4×-741..",
        "acceptedAnswers": [
          "3260.4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-001",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 14×s - 7×s = -5×c - 0×s + 8×s - 32; -31×s = 12×c + 344. Найдите c.",
        "acceptedAnswers": [
          "-8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-SYSTEM-004",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 4110×x - 4115×x + 133 = -4×w; 2×w - 5×x + 129 = 0. Найдите w.",
        "acceptedAnswers": [
          "-2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-ARITH-009",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 588 + 27914.",
        "acceptedAnswers": [
          "28502"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_BASE-DM-MULT-006",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Найдите произведение чисел -2967 и -0,8..",
        "acceptedAnswers": [
          "2373.6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      }
    ]
  },
  {
    "schemaVersion": 1,
    "examTrack": "ege_profile",
    "year": 2026,
    "version": "2026.1",
    "title": "Учебный банк математики · ЕГЭ по математике · профильный уровень · синтетические задания",
    "sourceKind": "imported",
    "metadata": {
      "dataset": "DeepMind Mathematics Dataset",
      "datasetVersion": "1.0.1",
      "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
      "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
      "paperUrl": "https://openreview.net/pdf?id=H1gR5iR5FX",
      "license": "Apache-2.0",
      "attribution": "DeepMind Technologies Limited",
      "generatedQuestions": true,
      "disclaimer": "Учебный банк из синтетических задач; не является официальным КИМ ОГЭ/ЕГЭ и не гарантирует соответствие спецификации экзамена."
    },
    "topics": [
      {
        "code": "DM-ARITH",
        "title": "Арифметические вычисления",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 1
      },
      {
        "code": "DM-MULT",
        "title": "Умножение чисел",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 2
      },
      {
        "code": "DM-LINEAR",
        "title": "Линейные уравнения",
        "section": "Алгебра",
        "aliases": [],
        "position": 3
      },
      {
        "code": "DM-SYSTEM",
        "title": "Системы линейных уравнений",
        "section": "Алгебра",
        "aliases": [],
        "position": 4
      },
      {
        "code": "DM-SEQUENCE",
        "title": "Последовательности",
        "section": "Алгебра",
        "aliases": [],
        "position": 5
      },
      {
        "code": "DM-GCD",
        "title": "Делимость и общий делитель",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 6
      },
      {
        "code": "DM-PLACE",
        "title": "Разряды числа",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 7
      },
      {
        "code": "DM-REMAINDER",
        "title": "Деление с остатком",
        "section": "Числа и вычисления",
        "aliases": [],
        "position": 8
      }
    ],
    "tasks": [
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-005",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -82×z + 289 = -18×z - 479. Найдите z.",
        "acceptedAnswers": [
          "12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-004",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -30793, -61568, -92343, -123118, -153893.",
        "acceptedAnswers": [
          "-184668"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-008",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -0,8×-300910.",
        "acceptedAnswers": [
          "240728"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-005",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков тысяч в числе 76538.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-006",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел -2 и 14,101722.",
        "acceptedAnswers": [
          "16.101722"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-015",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -60×g = 108×g + 1848. Найдите g.",
        "acceptedAnswers": [
          "-11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-008",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 2057, 2059, 2059, 2057, 2053, 2047.",
        "acceptedAnswers": [
          "2039"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-013",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -2,4 - -3190,5.",
        "acceptedAnswers": [
          "3188.1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-001",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -16, 69, 300, 749, 1488, 2589, 4124, 6165.",
        "acceptedAnswers": [
          "8784"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-010",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 0,5 − (140042778).",
        "acceptedAnswers": [
          "-140042777.5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-008",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -33×u + 8935 = 8176. Найдите u.",
        "acceptedAnswers": [
          "23"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-007",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -s + 2247×i - 1152×i + 10 = 1092×i; -2×i = 5×s - 16. Найдите s.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-006",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -38522, -38505, -38488, -38471, -38454, -38437.",
        "acceptedAnswers": [
          "-38420"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-008",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 45 и 1655559?.",
        "acceptedAnswers": [
          "9"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-010",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 43 на 6.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-002",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 54229 и 427..",
        "acceptedAnswers": [
          "427"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-018",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = 172×a - 5582 + 1798. Найдите a.",
        "acceptedAnswers": [
          "22"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-004",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 51 на 45.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-001",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 0 = 2×y + 5×r + 2945 - 2946; 8×r - 2 = -3×y. Найдите y.",
        "acceptedAnswers": [
          "-2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-007",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -1 - 12363,16.",
        "acceptedAnswers": [
          "-12364.16"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-009",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -8358×v = -8428×v - 560. Найдите v.",
        "acceptedAnswers": [
          "-8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-004",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 5187 и 1911?.",
        "acceptedAnswers": [
          "273"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-003",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 26 и 4800406?.",
        "acceptedAnswers": [
          "26"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-009",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 766 на 238.",
        "acceptedAnswers": [
          "52"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-005",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 5696×0,12..",
        "acceptedAnswers": [
          "683.52"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-009",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -1838×-0,3..",
        "acceptedAnswers": [
          "551.4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-001",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру единиц в числе 123.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-006",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 46038 и 24..",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-003",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -2×a - 5×n = -17067 + 17043; -2×a + 12 = 2×n - 0. Найдите a.",
        "acceptedAnswers": [
          "2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-003",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 387 на 28.",
        "acceptedAnswers": [
          "23"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-004",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков в числе 73383.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-010",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 0,5×-177,5.",
        "acceptedAnswers": [
          "-88.75"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-015",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -5 − (0,061407547).",
        "acceptedAnswers": [
          "-5.061407547"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-005",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 976 и 688?.",
        "acceptedAnswers": [
          "16"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-006",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -0,09×-202314..",
        "acceptedAnswers": [
          "18208.26"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-008",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -14×b - 2×q - 238 = 0; 2×b + 1445×q - 725×q = 725×q - 34. Найдите b.",
        "acceptedAnswers": [
          "-17"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-004",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 3×-937.",
        "acceptedAnswers": [
          "-2811"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-001",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 265758 и 24..",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-007",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 5 = 23×k - 22×k. Найдите k.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-019",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 90 = 54×f + 684. Найдите f.",
        "acceptedAnswers": [
          "-11"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-012",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -14×z = -36×z - 24×z - 1196. Найдите z.",
        "acceptedAnswers": [
          "-26"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-008",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 3903.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-006",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = -706×t + 692×t + 42. Найдите t.",
        "acceptedAnswers": [
          "3"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-008",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 29953 − (-379).",
        "acceptedAnswers": [
          "30332"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-018",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 23 − (0,192183378).",
        "acceptedAnswers": [
          "22.807816622"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-003",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -56×l - 343 = -294×l - 2009. Найдите l.",
        "acceptedAnswers": [
          "-7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-002",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -6×i - 34 = -124. Найдите i.",
        "acceptedAnswers": [
          "15"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-011",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 679 + 121 = -80×n. Найдите n.",
        "acceptedAnswers": [
          "-10"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-016",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 502×m + 653×m - 3109 = 2666. Найдите m.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-009",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 15570.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-002",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 1125 на 361.",
        "acceptedAnswers": [
          "42"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-007",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру единиц в числе 865.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-011",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 28,209 + -2201.",
        "acceptedAnswers": [
          "-2172.791"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-013",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -1603×w + 9656 = 246×w - 16230. Найдите w.",
        "acceptedAnswers": [
          "14"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-009",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -4527, -4535, -4543, -4551.",
        "acceptedAnswers": [
          "-4559"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-006",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 284 на 272.",
        "acceptedAnswers": [
          "12"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-005",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -19 - -1945171.",
        "acceptedAnswers": [
          "1945152"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-001",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 2920 на 580.",
        "acceptedAnswers": [
          "20"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-019",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел 0,04 и 188076360.",
        "acceptedAnswers": [
          "188076359.96"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-003",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -672927 × -0,3.",
        "acceptedAnswers": [
          "201878.1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-002",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру единиц в числе 105925.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-008",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 341 на 337.",
        "acceptedAnswers": [
          "4"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-007",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 223 на 46.",
        "acceptedAnswers": [
          "39"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-006",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 7×g + 923×t - 925×t + 1 + 3 = 4×g; -t = 5×g - 15. Найдите g.",
        "acceptedAnswers": [
          "2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-020",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 27170,70515 − (0,053).",
        "acceptedAnswers": [
          "27170.65215"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-010",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = -377×v - 37×v + 414. Найдите v.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-010",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 5447.",
        "acceptedAnswers": [
          "5"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-009",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 74245 и 155..",
        "acceptedAnswers": [
          "155"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-007",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -2926,7×4..",
        "acceptedAnswers": [
          "-11706.8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-014",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -67×f - 53×f - 8892 = -588×f. Найдите f.",
        "acceptedAnswers": [
          "19"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-003",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -14440, -28882, -43324.",
        "acceptedAnswers": [
          "-57766"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-004",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 138×m - 787 - 227 = -31×m. Найдите m.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-012",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -50599 - 8143..",
        "acceptedAnswers": [
          "-58742"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-010",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 636 и 17649?.",
        "acceptedAnswers": [
          "159"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-007",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -1442, -1363, -1230, -1043, -802, -507.",
        "acceptedAnswers": [
          "-158"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-REMAINDER-005",
        "topicCode": "DM-REMAINDER",
        "taskType": "div_remainder",
        "difficulty": "basic",
        "statement": "Найдите остаток от деления 548 на 18.",
        "acceptedAnswers": [
          "8"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.div_remainder",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-009",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: t + 5×h = -6; 939360×t - 7×h = 939361×t + 2. Найдите t.",
        "acceptedAnswers": [
          "-16"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-002",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -4384, -9025, -13668, -18313, -22960, -27609.",
        "acceptedAnswers": [
          "-32260"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-004",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -4×r - 2×n + 0×n + 2×n = 3×n + 28; 354×r + 4×n - 4858 = 1048×r. Найдите r.",
        "acceptedAnswers": [
          "-7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-001",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -56 + 538420507..",
        "acceptedAnswers": [
          "538420451"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-010",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: -3×u + 412684 = 412549; 4×u = -w - 0×u + u + 137. Найдите w.",
        "acceptedAnswers": [
          "2"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-003",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру тысяч в числе 27538.",
        "acceptedAnswers": [
          "7"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-002",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: -0,3×1,963..",
        "acceptedAnswers": [
          "-0.5889"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-005",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: 676, 704, 732, 760.",
        "acceptedAnswers": [
          "788"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-014",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 5 + -0,43272361..",
        "acceptedAnswers": [
          "4.56727639"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-MULT-001",
        "topicCode": "DM-MULT",
        "taskType": "mul",
        "difficulty": "standard",
        "statement": "Вычислите: 0,643408×-5.",
        "acceptedAnswers": [
          "-3.21704"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.mul",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-009",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -8,922673 + -4..",
        "acceptedAnswers": [
          "-12.922673"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SEQUENCE-010",
        "topicCode": "DM-SEQUENCE",
        "taskType": "sequence_next_term",
        "difficulty": "standard",
        "statement": "Найдите следующий член последовательности: -958, -890, -818, -742, -662, -578.",
        "acceptedAnswers": [
          "-490"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.sequence_next_term",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-PLACE-006",
        "topicCode": "DM-PLACE",
        "taskType": "place_value",
        "difficulty": "basic",
        "statement": "Назовите цифру десятков тысяч в числе 112172.",
        "acceptedAnswers": [
          "1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.place_value",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-003",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -285 + 1429,154.",
        "acceptedAnswers": [
          "1144.154"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-020",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 103×j = -453 - 886. Найдите j.",
        "acceptedAnswers": [
          "-13"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-017",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Найдите разность чисел 0,035396 и -20,2.",
        "acceptedAnswers": [
          "20.235396"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-002",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 4×x = 93×d - 348; -4×x + 37 - 17 = -d. Найдите x.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-002",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 7474078 + 0,77..",
        "acceptedAnswers": [
          "7474078.77"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-GCD-007",
        "topicCode": "DM-GCD",
        "taskType": "gcd",
        "difficulty": "standard",
        "statement": "Найдите наибольший общий делитель чисел 112 и 32624?.",
        "acceptedAnswers": [
          "16"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "numbers.gcd",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-001",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: 0 = -37×x - 111×x + 888. Найдите x.",
        "acceptedAnswers": [
          "6"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-016",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: 0,034 + -2482335,7..",
        "acceptedAnswers": [
          "-2482335.666"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-ARITH-004",
        "topicCode": "DM-ARITH",
        "taskType": "add_or_sub",
        "difficulty": "standard",
        "statement": "Вычислите: -922,01 - -25,3..",
        "acceptedAnswers": [
          "-896.71"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "arithmetic.add_or_sub",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-LINEAR-017",
        "topicCode": "DM-LINEAR",
        "taskType": "linear_1d",
        "difficulty": "standard",
        "statement": "Решите уравнение: -48×s = -114×s - 1122. Найдите s.",
        "acceptedAnswers": [
          "-17"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_1d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      },
      {
        "externalId": "DM-EGE_PROFILE-DM-SYSTEM-005",
        "topicCode": "DM-SYSTEM",
        "taskType": "linear_2d",
        "difficulty": "advanced",
        "statement": "Решите систему уравнений: 15×y + 108×j - 320×j + 111×j + 100×j - 9 = -24; 0 = -4×j. Найдите y.",
        "acceptedAnswers": [
          "-1"
        ],
        "sourceUrl": "https://github.com/google-deepmind/mathematics_dataset",
        "metadata": {
          "synthetic": true,
          "dataset": "DeepMind Mathematics Dataset",
          "generatorModule": "algebra.linear_2d",
          "sourceRevision": "427f45075f84b8b9774950196ad63867ca20ffb3",
          "license": "Apache-2.0",
          "attribution": "DeepMind Technologies Limited"
        }
      }
    ]
  }
] as CurriculumImportPayload[];

export function buildDeepMindCurricula(): CurriculumImportPayload[] {
  return CURRICULA;
}
