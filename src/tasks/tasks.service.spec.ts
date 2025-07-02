import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUser = {
  id: 'user1',
  username: 'testuser',
  password: 'testpassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = moduleRef.get(TasksService);
    tasksRepository = moduleRef.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const expected = 'someValue';
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      // Mock the getTasks method to return an empty array
      (tasksRepository.getTasks as jest.Mock).mockResolvedValue(expected);
      // call tasksService.getTasks which should then call repository's getTasks
      const result = await tasksService.getTasks(
        {} as GetTasksFilterDto,
        mockUser,
      );
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });
  describe('getTaskById', () => {
    it('calls TasksRepository.findOneBy and returns the task', async () => {
      const mockTask = new Task();
      mockTask.id = 'task1';
      mockTask.title = 'Test Task';
      mockTask.description = 'Test Description';
      mockTask.status = TaskStatus.OPEN;
      mockTask.user = mockUser;

      (tasksRepository.findOneBy as jest.Mock).mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('task1', mockUser);
      expect(tasksRepository.findOneBy).toHaveBeenCalledWith({
        id: 'task1',
        user: mockUser,
      });
      expect(result).toEqual(mockTask);
    });

    it('throws NotFoundException if task not found', async () => {
      const actualId = 'nonexistent';
      const expectedError = `Task with ID ${actualId} not found`;
      (tasksRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        tasksService.getTaskById(actualId, mockUser),
      ).rejects.toThrow(expectedError);
    });
  });
});
