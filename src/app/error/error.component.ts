import { Component, Input } from "@angular/core";
import { faMeh } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"]
})
export class ErrorComponent {
  @Input()
  public error: any;
  public icon = faMeh;
}
