import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstructionComponent } from './instruction.component';

describe('InstructionComponent', () => {
  let component: InstructionComponent;
  let fixture: ComponentFixture<InstructionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InstructionComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
