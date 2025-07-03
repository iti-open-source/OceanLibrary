import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs";
import {
  LucideAngularModule,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-angular";

import { BooksService } from "../../../../services/books.service";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { Book } from "../../../../types/book.interface";
import {
  CreateBookOptions,
  UpdateBookOptions,
} from "../../../../types/bookOptions";

@Component({
  selector: "app-books-form",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ErrorModalComponent,
  ],
  templateUrl: "./books-form.component.html",
  styleUrl: "./books-form.component.css",
})
export class BooksFormComponent implements OnInit, OnDestroy {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId: string | null = null;
  loading = false;
  submitting = false;
  imagePreview: string | null = null;

  // Error modal properties
  showErrorModal = false;
  errorModalTitle = "Error";
  errorModalMessage = "";
  errorModalShowAction = false;
  errorModalActionText = "Try Again";

  // Auto-save
  private autoSaveKey = "";
  private destroy$ = new Subject<void>();
  private formValueChanges$ = new Subject<void>();

  // Lucide icons
  readonly Save = Save;
  readonly X = X;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Upload = Upload;
  readonly ImageIcon = ImageIcon;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
    this.setupAutoSave();
    this.setupImagePreview();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.bookForm = this.fb.group({
      title: ["", [Validators.required, Validators.maxLength(200)]],
      authorName: ["", [Validators.required, Validators.maxLength(100)]],
      genres: this.fb.array([this.fb.control("", Validators.required)]),
      price: [null, [Validators.required, Validators.min(0.01)]],
      pages: [null, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ["", [Validators.maxLength(1000)]],
      image: ["", [this.urlValidator]],
    });
  }

  private checkEditMode() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.bookId = params["id"];
        this.autoSaveKey = `book_edit_${this.bookId}`;
        this.loadBookData();
      } else {
        this.isEditMode = false;
        this.autoSaveKey = "book_create";
        this.loadAutoSavedData();
      }
    });
  }

  private loadBookData() {
    this.loading = true;
    this.booksService.getBookById(this.bookId!).subscribe({
      next: (response) => {
        const book: Book = response.data.book;
        console.log(book);
        this.populateForm(book);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showError(
          "Failed to Load Book",
          "Unable to load book data. The book may not exist or there was a connection error.",
          true,
          () => this.loadBookData()
        );
      },
    });
  }

  private populateForm(book: Book) {
    // Clear genres array first
    this.genresArray.clear();

    // Add genres
    book.genres.forEach((genre) => {
      this.genresArray.push(this.fb.control(genre, Validators.required));
    });

    // Populate other fields
    this.bookForm.patchValue({
      title: book.title,
      authorName: book.authorName,
      price: book.price,
      pages: book.pages, // Note: API uses 'page' but form uses 'pages'
      stock: book.stock,
      description: book.description,
      image: book.image,
    });

    if (book.image) {
      this.imagePreview = book.image;
    }
  }

  private setupAutoSave() {
    this.bookForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (this.bookForm.dirty && !this.submitting) {
          localStorage.setItem(this.autoSaveKey, JSON.stringify(value));
        }
      });
  }

  private loadAutoSavedData() {
    const savedData = localStorage.getItem(this.autoSaveKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Clear genres array first
        this.genresArray.clear();

        // Add saved genres
        if (parsedData.genres && Array.isArray(parsedData.genres)) {
          parsedData.genres.forEach((genre: string) => {
            if (genre.trim()) {
              this.genresArray.push(
                this.fb.control(genre, Validators.required)
              );
            }
          });
        }

        // If no genres were loaded, add one empty control
        if (this.genresArray.length === 0) {
          this.genresArray.push(this.fb.control("", Validators.required));
        }

        // Patch other form values (excluding genres as we handled them above)
        const { genres, ...otherValues } = parsedData;
        this.bookForm.patchValue(otherValues);
      } catch (error) {
        console.warn("Failed to load auto-saved data:", error);
        localStorage.removeItem(this.autoSaveKey);
      }
    }
  }

  private setupImagePreview() {
    this.bookForm
      .get("image")
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((url) => {
        if (url && this.isValidUrl(url)) {
          this.imagePreview = url;
        } else {
          this.imagePreview = null;
        }
      });
  }

  private clearAutoSave() {
    localStorage.removeItem(this.autoSaveKey);
  }

  get genresArray(): FormArray {
    return this.bookForm.get("genres") as FormArray;
  }

  addGenre() {
    this.genresArray.push(this.fb.control("", Validators.required));
  }

  removeGenre(index: number) {
    if (this.genresArray.length > 1) {
      this.genresArray.removeAt(index);
    }
  }

  onSubmit() {
    if (this.bookForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.bookForm.value;

      // Filter out empty genres
      const filteredGenres = formValue.genres.filter((genre: string) =>
        genre.trim()
      );

      const bookData = {
        ...formValue,
        genres: filteredGenres,
        pages: formValue.pages, // Ensure we use 'pages' for API
      };

      if (this.isEditMode) {
        this.updateBook(bookData);
      } else {
        this.createBook(bookData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createBook(bookData: CreateBookOptions) {
    this.booksService.createBook(bookData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.clearAutoSave();
        this.router.navigate(["/admin/books"]);
      },
      error: (error) => {
        this.submitting = false;
        this.showError(
          "Failed to Create Book",
          error.error?.message ||
            "Unable to create the book. Please check your data and try again.",
          true,
          () => this.createBook(bookData)
        );
      },
    });
  }

  private updateBook(bookData: UpdateBookOptions) {
    this.booksService.updateBookById(this.bookId!, bookData).subscribe({
      next: (response) => {
        this.submitting = false;
        this.clearAutoSave();
        this.router.navigate(["/admin/books"]);
      },
      error: (error) => {
        this.submitting = false;
        this.showError(
          "Failed to Update Book",
          error.error?.message ||
            "Unable to update the book. Please check your data and try again.",
          true,
          () => this.updateBook(bookData)
        );
      },
    });
  }

  onCancel() {
    if (this.bookForm.dirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        this.clearAutoSave();
        this.router.navigate(["/admin/books"]);
      }
    } else {
      this.router.navigate(["/admin/books"]);
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.bookForm.controls).forEach((key) => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((ctrl) => ctrl.markAsTouched());
      }
    });
  }

  // Validation helpers
  private urlValidator(control: any) {
    if (!control.value) return null;
    return control.value && !control.value.match(/^https?:\/\/.+/)
      ? { invalidUrl: true }
      : null;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.match(/^https?:\/\/.+/) !== null;
    } catch {
      return false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["maxlength"])
        return `${fieldName} is too long (max ${field.errors["maxlength"].requiredLength} characters)`;
      if (field.errors["min"])
        return `${fieldName} must be greater than ${field.errors["min"].min}`;
      if (field.errors["invalidUrl"]) return "Please enter a valid URL";
    }
    return "";
  }

  // Error modal methods
  private showError(
    title: string,
    message: string,
    showAction = false,
    actionCallback?: () => void
  ) {
    this.errorModalTitle = title;
    this.errorModalMessage = message;
    this.errorModalShowAction = showAction;
    this.showErrorModal = true;

    if (actionCallback) {
      this.errorActionCallback = actionCallback;
    }
  }

  onErrorModalClose() {
    this.showErrorModal = false;
  }

  onErrorModalAction() {
    this.showErrorModal = false;
    if (this.errorActionCallback) {
      this.errorActionCallback();
    }
  }

  private errorActionCallback?: () => void;
}
