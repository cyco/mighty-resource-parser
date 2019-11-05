import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesheetInspectorComponent } from './shapesheet-inspector.component';

describe('ShapesheetInspectorComponent', () => {
  let component: ShapesheetInspectorComponent;
  let fixture: ComponentFixture<ShapesheetInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapesheetInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapesheetInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
