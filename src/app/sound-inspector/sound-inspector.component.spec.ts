import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundInspectorComponent } from './sound-inspector.component';

describe('SoundInspectorComponent', () => {
  let component: SoundInspectorComponent;
  let fixture: ComponentFixture<SoundInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
