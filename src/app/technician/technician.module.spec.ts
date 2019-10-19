import { TechnicianModule } from './technician.module';

describe('TechnicianModule', () => {
  let technicianModule: TechnicianModule;

  beforeEach(() => {
    technicianModule = new TechnicianModule();
  });

  it('should create an instance', () => {
    expect(technicianModule).toBeTruthy();
  });
});
