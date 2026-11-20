import { defineConfig, devices } from '@playwright/test';

/**
 * 画面の E2E テスト（`npm run test:e2e`）。
 * デモモード（例データ、バックエンドに接続しない）の画面を、PC の Chromium とスマートフォンの Safari で操作する。
 * 対象の端末（projects）は、作るアプリの使われ方に合わせて変える。
 * 例データはページを開くたびに初期状態へ戻るため、テスト同士は影響しない。
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5199',
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // iPhone の Safari と同じ描画エンジン（WebKit）、画面の大きさ、タッチ操作
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
  ],
  webServer: {
    command: 'npm run demo',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
