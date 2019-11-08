import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "./app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { DetailComponent } from "./detail/detail.component";
import { InstructionComponent } from "./instruction/instruction.component";
import { DetailLoadingComponent } from "./detail-loading/detail-loading.component";
import { ErrorComponent } from "./error/error.component";
import { ImageInspectorComponent } from "./image-inspector/image-inspector.component";
import { PaletteImageComponent } from "./palette-image/palette-image.component";
import { SoundsheetInspectorComponent } from "./soundsheet-inspector/soundsheet-inspector.component";
import { SoundInspectorComponent } from "./sound-inspector/sound-inspector.component";
import { ShapesheetInspectorComponent } from "./shapesheet-inspector/shapesheet-inspector.component";
import { ShapeImageComponent } from "./shape-image/shape-image.component";
import { TilesetInspectorComponent } from "./tileset-inspector/tileset-inspector.component";
import { MapInspectorComponent } from "./map-inspector/map-inspector.component";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DetailComponent,
    InstructionComponent,
    DetailLoadingComponent,
    ErrorComponent,
    ImageInspectorComponent,
    PaletteImageComponent,
    SoundsheetInspectorComponent,
    SoundInspectorComponent,
    ShapesheetInspectorComponent,
    ShapeImageComponent,
    TilesetInspectorComponent,
    MapInspectorComponent
  ],
  imports: [BrowserModule, HttpClientModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
