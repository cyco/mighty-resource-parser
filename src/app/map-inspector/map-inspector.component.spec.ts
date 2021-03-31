import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MapInspectorComponent } from "./map-inspector.component";

describe("MapInspectorComponent", () => {
  let component: MapInspectorComponent;
  let fixture: ComponentFixture<MapInspectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MapInspectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
