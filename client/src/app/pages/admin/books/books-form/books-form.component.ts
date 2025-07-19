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
  Edit3,
} from "lucide-angular";

import { BooksService } from "../../../../services/books.service";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { Book } from "../../../../types/book.interface";

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
  selectedImageFile: File | null = null;
  dragOver = false;

  // Author ID field visibility
  showAuthorIdField = false;

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
  readonly Edit3 = Edit3;

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
      authorID: [""], // Made optional - no required validator
      genres: this.fb.array([this.fb.control("", Validators.required)]),
      price: [null, [Validators.required, Validators.min(0.01)]],
      pages: [null, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ["", [Validators.maxLength(1000)]],
      image: [""], // Removed URL validator since we're using file uploads
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
      authorID: book.authorID,
      price: book.price,
      pages: book.pages, // Note: API uses 'page' but form uses 'pages'
      stock: book.stock,
      description: book.description,
      image: book.image,
    });

    if (book.image) {
      this.imagePreview = book.image;
    }

    // Show author ID field if there's a value
    if (book.authorID) {
      this.showAuthorIdField = true;
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

        // Show author ID field if there's a value
        if (otherValues.authorID) {
          this.showAuthorIdField = true;
        }
      } catch (error) {
        console.warn("Failed to load auto-saved data:", error);
        localStorage.removeItem(this.autoSaveKey);
      }
    }
  }

  private setupImagePreview() {
    // Image preview is now handled by file upload methods
    // This method can be used for other image-related setup if needed
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

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append("title", formValue.title);
      formData.append("authorName", formValue.authorName);
      // Only append authorID if it's not empty
      if (formValue.authorID && formValue.authorID.trim()) {
        formData.append("authorID", formValue.authorID.trim());
      }
      formData.append("price", formValue.price.toString());
      formData.append("pages", formValue.pages.toString());
      formData.append("stock", formValue.stock.toString());
      formData.append("description", formValue.description || "");

      // Add genres as separate entries or as JSON string
      filteredGenres.forEach((genre: string, index: number) => {
        formData.append(`genres[${index}]`, genre);
      });

      // Add image file if selected
      if (this.selectedImageFile) {
        formData.append("image", this.selectedImageFile);
      }

      if (this.isEditMode) {
        this.updateBook(formData);
      } else {
        this.createBook(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createBook(formData: FormData) {
    this.booksService.createBook(formData).subscribe({
      next: (response: any) => {
        this.submitting = false;
        this.clearAutoSave();
        this.router.navigate(["/admin/books"]);
      },
      error: (error: any) => {
        this.submitting = false;
        this.showError(
          "Failed to Create Book",
          this.getErrorMessage(error) ||
            "Unable to create the book. Please check your data and try again.",
          true,
          () => this.createBook(formData)
        );
      },
    });
  }

  private updateBook(formData: FormData) {
    this.booksService.updateBookById(this.bookId!, formData).subscribe({
      next: (response: any) => {
        this.submitting = false;
        this.clearAutoSave();
        this.router.navigate(["/admin/books"]);
      },
      error: (error: any) => {
        this.submitting = false;
        this.showError(
          "Failed to Update Book",
          this.getErrorMessage(error) ||
            "Unable to update the book. Please check your data and try again.",
          true,
          () => this.updateBook(formData)
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

  // Author ID field management
  toggleAuthorIdEdit() {
    this.showAuthorIdField = !this.showAuthorIdField;
  }

  clearAuthorId() {
    this.bookForm.get("authorID")?.setValue("");
  }

  hideAuthorIdField() {
    this.showAuthorIdField = false;
  }

  // Validation helpers

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
    }
    return "";
  }

  // Image upload methods
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleImageFile(input.files[0]);
    }
  }

  onImageDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleImageFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  private handleImageFile(file: File) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      this.showError(
        "Invalid File Type",
        "Please select an image file (PNG, JPG, GIF, WebP)."
      );
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.showError(
        "File Too Large",
        "Please select an image smaller than 10MB."
      );
      return;
    }

    this.selectedImageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Mark the image field as valid since we have a file
    this.bookForm.get("image")?.setValue("has-file");
    this.bookForm.get("image")?.markAsTouched();
  }

  removeImage() {
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.bookForm.get("image")?.setValue("");
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

  // Helper method to extract error messages
  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "";
  }
}
