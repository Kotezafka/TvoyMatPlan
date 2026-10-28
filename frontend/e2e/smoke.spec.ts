import { expect, test } from '@playwright/test';

test('главная открывается', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Урок, доска и отчёт родителям/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Сколько длится занятие?' }).click();
  await expect(page.getByText(/Обычный слот — один час/)).toBeVisible();
});

test('преподаватель входит и открывает кабинет', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill('teacher@tutor.local');
  await page.getByLabel('Пароль').fill('Teacher12345');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await page.waitForURL(/\/dashboard\/teacher/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('урок не получает 401 от LiveKit и не сыпет 409 на доску', async ({
  page,
}) => {
  const failures: string[] = [];
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/rtc/validate') && response.status() === 401) {
      failures.push(`validate ${response.status()}`);
    }
    if (url.includes('/board') && response.status() === 409) {
      failures.push(`board ${response.status()}`);
    }
  });

  await page.goto('/auth/login');
  await page.getByLabel('Email').fill('teacher@tutor.local');
  await page.getByLabel('Пароль').fill('Teacher12345');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await page.waitForURL(/\/dashboard\/teacher/);

  const token = await page.evaluate(() => localStorage.getItem('access_token'));
  const slots = await page.request.get('http://localhost:3001/api/calendar/teacher', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const list = (await slots.json()) as Array<{ id: string; startTime: string }>;
  const upcoming = list
    .filter((slot) => new Date(slot.startTime).getTime() > Date.now() - 60 * 60_000)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )[0];
  expect(upcoming, 'нет ближайшего слота').toBeTruthy();
  if (!upcoming) return;
  await page.goto(`/dashboard/teacher/lesson/${upcoming.id}?view=board`);
  await page.waitForTimeout(6000);
  await expect(page.getByRole('button', { name: /Включить ИИ-речь|Остановить ИИ-речь/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Потоковый ИИ|Остановить микрофон ИИ/ })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Подсказки по доске' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Тема для подбора задачи' })).toBeVisible();
  await page.getByRole('button', { name: 'Свернуть подсказки' }).click();
  await expect(page.getByRole('textbox', { name: 'Тема для подбора задачи' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Развернуть подсказки' })).toBeVisible();
  await page.getByRole('button', { name: 'Развернуть подсказки' }).click();
  await expect(page.getByRole('textbox', { name: 'Тема для подбора задачи' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Что решать' })).toBeVisible();
  await expect(page.getByText('На этом уроке')).toBeVisible();
  await page.getByRole('button', { name: 'Свернуть подбор задач' }).click();
  await expect(page.getByText('На этом уроке')).toHaveCount(0);
  await page.getByRole('button', { name: 'Что решать' }).click();
  await expect(page.getByText('На этом уроке')).toBeVisible();
  expect(failures, failures.join(', ')).toEqual([]);
});

test('подсказка по введённой теме не сбрасывается пустым событием доски', async ({ page }) => {
  await page.route('**/api/video/token?slotId=*', (route) => {
    const claims = Buffer.from(JSON.stringify({
      iss: 'e2e',
      sub: 'e2e',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      video: { roomJoin: true, room: 'e2e-room' },
    })).toString('base64url');
    return route.fulfill({
      json: {
        token: `e30.${claims}.sig`,
        url: 'wss://live.example.test',
        room: 'e2e-room',
        lessonId: 'e2e-lesson-id',
        lessonStatus: 'active',
      },
    });
  });
  await page.route('**/api/lessons/e2e-lesson-id/status', (route) =>
    route.fulfill({ json: { status: 'active' } }),
  );
  await page.route('**/api/lessons/e2e-lesson-id/board', (route) =>
    route.request().method() === 'GET'
      ? route.fulfill({ json: { elements: [], appState: {}, files: {}, revision: 0 } })
      : route.fulfill({ json: { ok: true } }),
  );
  await page.route('**/api/learning/lessons/e2e-lesson-id/live-assist', (route) =>
    route.fulfill({
      json: {
        topic: { id: 'test-topic', title: 'Уравнения' },
        suggestion: { id: 'test-task', title: 'Уравнения', task: 'Тестовая задача по теме', reason: 'Подходит к теме' },
      },
    }),
  );

  await page.goto('/auth/login');
  await page.getByLabel('Email').fill('teacher@tutor.local');
  await page.getByLabel('Пароль').fill('Teacher12345');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await page.waitForURL(/\/dashboard\/teacher/);
  await page.goto('/dashboard/teacher/lesson/e2e-slot-id?view=board');
  await expect(page.getByRole('heading', { name: 'Подсказки по доске' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Тема для подбора задачи' }).fill('уравнения');
  const response = page.waitForResponse((item) => item.url().includes('/live-assist'));
  await page.getByRole('button', { name: 'Подобрать' }).click();
  expect((await response).ok()).toBeTruthy();
  await expect(page.getByText('Тестовая задача по теме')).toBeVisible();
  await expect(page.getByRole('button', { name: /Включить ИИ-речь|Потоковый ИИ/ })).toHaveCount(0);
});
