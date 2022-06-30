import { Component, OnInit } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-creation-rubrics-questions',
  templateUrl: './creation-rubrics-questions.component.html',
  styleUrls: ['./creation-rubrics-questions.component.scss']
})
export class CreationRubricsQuestionsComponent implements OnInit {

  faTrashAlt = faTrashAlt;
  faPlusCircle = faPlusCircle;

  constructor() { }

  ngOnInit(): void {
  }

}
