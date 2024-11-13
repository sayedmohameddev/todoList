import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../../core/services/todo.service';
import { Todo } from '../../core/interfaces/todo';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TodoSearchPipe } from '../../core/pipes/todo-search.pipe';
import { TodoFilterPipe } from '../../core/pipes/todo-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, TodoSearchPipe, FormsModule, TodoFilterPipe, NgxPaginationModule, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly _ToastrService = inject(ToastrService);
  private readonly _TodoService = inject(TodoService);
  userName = JSON.parse(localStorage.getItem('userName')!);
  apiKey = JSON.parse(localStorage.getItem('apiKey')!);
  allTodos!: Todo[];
  todosCount!: number;
  searchText!: string;
  filterOption: string = 'newest';
  page: any = 1;
  total!: any;

  getTodos(): void {
    this._TodoService.getallTodos(this.apiKey).subscribe({
      next: (res) => {
        this.allTodos = res.todos;
        this.todosCount = res.todos.length;
      }
    });
  }

  openInputModal() {
    Swal.fire({
      title: 'Enter your Todo Name',
      input: 'text',
      inputPlaceholder: 'Type your todo name',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      background: '#f0f0f0',
    }).then((result) => {
      if (result.isConfirmed) {
        const inputValue = result.value;
        this._TodoService.addTodo(inputValue, this.apiKey).subscribe({
          next: (res) => {
            this.getTodos();
            Swal.fire({
              title: 'Todo Added',
              text: 'Your todo has been added successfully',
              icon: 'success',
            });
          },
          error: (err) => {
            this._ToastrService.error('Failed to add Todo', 'Error');
          }
        });
      }
    });
  }

  changepage(event: any) {
    this.page = event;
  }


  deleteTodo(todoId: string): void {
    this._TodoService.deleteTodo(todoId).subscribe({
      next: (res) => {
        this.getTodos();
        this._ToastrService.success('Your Todo is successfuly deleted');
      }
    })
  }

  markComplete(todoid: string): void {
    this._TodoService.markCompleted(todoid).subscribe({
      next: (res) => {
        this.getTodos();
        this._ToastrService.success('Congrats! You have Completed your Todo!')
      }
    });
  }

  ngOnInit(): void {
    this.getTodos();
  }

}
