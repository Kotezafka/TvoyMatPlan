import { Readable, Writable } from 'stream';
import { PATH_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { MockExamsController } from './mock-exams.controller';

describe('MockExamsController image route', () => {
  it('streams the authorized image with private cache headers', async () => {
    const imageKey = 'curriculum/assets/mathstart/ege_profile/hash/task-1/0.webp';
    const stream = Readable.from(['webp-bytes']);
    const exams = { getAuthorizedImageKey: jest.fn().mockResolvedValue(imageKey) };
    const storage = { getObject: jest.fn().mockResolvedValue(stream) };
    const controller = new MockExamsController(exams as any, storage as any);
    const response = new Writable({ write: (_chunk, _encoding, callback) => callback() }) as any;
    response.setHeader = jest.fn();
    const finished = new Promise<void>((resolve, reject) => {
      response.once('finish', resolve);
      response.once('error', reject);
    });

    await controller.image({ id: 'user-1' } as any, 'exam-1', 'task-1', 0, response);
    await finished;

    expect(exams.getAuthorizedImageKey).toHaveBeenCalledWith({ id: 'user-1' }, 'exam-1', 'task-1', 0);
    expect(storage.getObject).toHaveBeenCalledWith(imageKey);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'image/webp');
    expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', 'private, max-age=3600');
  });

  it('exposes the image stream only to authenticated student, teacher, and admin routes', () => {
    const handler = (MockExamsController.prototype as any).image;

    expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe(':id/items/:taskId/images/:index');
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]);
  });
});
