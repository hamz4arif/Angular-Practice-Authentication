import {
  animate,
  group,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  animations: [
    trigger("divState", [
      state(
        "normal",
        style({
          "background-color": "red",
          transform: "translateX(0)",
        })
      ),
      state(
        "highlighted",
        style({
          "background-color": "blue",
          transform: "translateX(100px)",
        })
      ),
      transition("normal<=>highlighted", animate(500)),
    ]),
    trigger("wildState", [
      state(
        "normal",
        style({
          "background-color": "red",
          transform: "translateX(0) scale(1)",
        })
      ),
      state(
        "highlighted",
        style({
          "background-color": "blue",
          transform: "translateX(100px) scale(1)",
        })
      ),
      state(
        "shrunkin",
        style({
          "background-color": "green",
          transform: "translateX(0px) scale(0.5)",
        })
      ),
      transition("normal<=>highlighted", animate(500)),
      transition("shrunkin<=>*", [
        style({
          "background-color": "orange",
        }),
        style({ borderRadius: "50px" }),
        animate(500),
      ]),
    ]),
    trigger("list1", [
      transition("void=>*", [
        style({
          opacity: "1",
          transform: "translateX(-100px)",
        }),
        group([
          animate(
            100,
            style({
              color: "red",
              fontSize:'50px'
            })
          ),
          animate(
            500,
            style({
              opacity: 1,
              transform: "translateX(-100px)",
            })
          ),
          animate(300),
        ]),
      ]),
      transition("*=>void", [
        style({
          transform: "translateX(100px)",
          opacity: "10",
        }),
        animate(500),
      ]),
    ]),
  ],
})
export class AppComponent {
  state = "normal";
  wildstate = "normal";
  list = ["Milk", "Sugar", "Bread"];

  onAdd(item) {
    this.list.push(item);
  }
  onDelete(val) {
    console.log(val);
    this.list.splice(val, 1);
  }
  onChange() {
    this.state == "normal"
      ? (this.state = "highlighted")
      : (this.state = "normal");

    this.wildstate == "normal"
      ? (this.wildstate = "highlighted")
      : (this.wildstate = "normal");
  }
  onShrunk() {
    this.wildstate = "shrunkin";
  }
  onanimationStart(event){
    console.log(event)
  }
  onanimationDone(event){
    console.log(event)
  }
}
