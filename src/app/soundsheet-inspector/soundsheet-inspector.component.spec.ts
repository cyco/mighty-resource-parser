import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoundsheetInspectorComponent } from './soundsheet-inspector.component';

describe('SoundsheetInspectorComponent', () => {
  let component: SoundsheetInspectorComponent;
  let fixture: ComponentFixture<SoundsheetInspectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SoundsheetInspectorComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundsheetInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
