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
import { Subject, takeUntil } from "rxjs";
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
  User,
} from "lucide-angular";

import { AuthorsService } from "../../../../services/authors.service";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { Author } from "../../../../types/author.interface";

@Component({
  selector: "app-authors-form",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ErrorModalComponent,
  ],
  templateUrl: "./authors-form.component.html",
  styleUrl: "./authors-form.component.css",
})
export class AuthorsFormComponent implements OnInit, OnDestroy {
  authorForm!: FormGroup;
  isEditMode = false;
  authorId: string | null = null;
  loading = false;
  submitting = false;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  dragOver = false;

  // Error modal properties
  showErrorModal = false;
  errorModalTitle = "Error";
  errorModalMessage = "";
  errorModalShowAction = false;
  errorModalActionText = "Try Again";

  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly Save = Save;
  readonly X = X;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Upload = Upload;
  readonly ImageIcon = ImageIcon;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly User = User;

  constructor(
    private fb: FormBuilder,
    private authorsService: AuthorsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.authorForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      bio: ["", [Validators.maxLength(2000)]],
      nationality: ["", [Validators.maxLength(50)]],
      genres: this.fb.array([this.fb.control("")]), // Remove required validator
      photo: [""], // For file uploads
    });
  }

  private checkEditMode() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.authorId = params["id"];
        this.loadAuthor();
      }
    });
  }

  private loadAuthor() {
    if (!this.authorId) return;

    this.loading = true;
    this.authorsService.getAuthorById(this.authorId).subscribe({
      next: (response) => {
        if (response.status === "Success" && response.data) {
          const author = response.data.author;
          this.populateForm(author);
          this.imagePreview = author.photo;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading author:", error);
        this.showError(
          "Load Error",
          error.error?.message || "Failed to load author"
        );
        this.loading = false;
      },
    });
  }

  private populateForm(author: Author) {
    // First patch the simple form values
    this.authorForm.patchValue({
      name: author.name,
      bio: author.bio || "",
      nationality: author.nationality || "",
      photo: "",
    });

    // Handle genres array separately and more carefully
    const genresArray = this.authorForm.get("genres") as FormArray;

    // Clear existing controls
    while (genresArray.length !== 0) {
      genresArray.removeAt(0);
    }

    // Add genre controls
    if (author.genres && author.genres.length > 0) {
      author.genres.forEach((genre) => {
        genresArray.push(this.fb.control(genre));
      });
    } else {
      genresArray.push(this.fb.control(""));
    }
  }

  get genres(): FormArray {
    return this.authorForm?.get("genres") as FormArray;
  }

  addGenre() {
    this.genres.push(this.fb.control(""));
  }

  removeGenre(index: number) {
    if (this.genres.length > 1) {
      this.genres.removeAt(index);
    }
  }

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        this.showError("Invalid File", "Please select a valid image file.");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
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
    }
  }

  removeImage() {
    this.selectedImageFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById("photo") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  onSubmit() {
    if (this.authorForm.invalid || this.submitting) {
      this.markFormGroupTouched(this.authorForm);
      return;
    }

    this.submitting = true;
    const formData = this.createFormData();

    const saveOperation = this.isEditMode
      ? this.authorsService.updateAuthorById(this.authorId!, formData)
      : this.authorsService.createAuthor(formData);

    saveOperation.subscribe({
      next: (response) => {
        console.log("Author saved successfully:", response);
        this.router.navigate(["/admin/authors"]);
      },
      error: (error) => {
        console.error("Error saving author:", error);
        this.showError(
          this.isEditMode ? "Update Error" : "Create Error",
          error.error?.message ||
            `Failed to ${this.isEditMode ? "update" : "create"} author`
        );
        this.submitting = false;
      },
    });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.authorForm.value;

    formData.append("name", formValue.name);

    if (formValue.bio) {
      formData.append("bio", formValue.bio);
    }

    if (formValue.nationality) {
      formData.append("nationality", formValue.nationality);
    }

    // Handle genres array
    const genres = formValue.genres.filter((genre: string) => genre.trim());
    if (genres.length > 0) {
      genres.forEach((genre: string) => {
        formData.append("genres[]", genre.trim());
      });
    }

    // Add image file if selected
    if (this.selectedImageFile) {
      formData.append("photo", this.selectedImageFile);
    }

    return formData;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  onCancel() {
    this.router.navigate(["/admin/authors"]);
  }

  private showError(title: string, message: string, showAction = false): void {
    this.errorModalTitle = title;
    this.errorModalMessage = message;
    this.errorModalShowAction = showAction;
    this.showErrorModal = true;
  }

  onErrorModalAction(): void {
    this.showErrorModal = false;
  }

  onErrorModalClose(): void {
    this.showErrorModal = false;
  }

  // Debug method to check form validity
  logFormValidity(): void {
    console.log("Form validity:", this.authorForm.valid);
    console.log("Form errors:", this.authorForm.errors);
    Object.keys(this.authorForm.controls).forEach((key) => {
      const control = this.authorForm.get(key);
      if (control?.invalid) {
        console.log(`${key} errors:`, control.errors);
      }
    });
  }

  // Helper methods for validation
  hasError(field: string): boolean {
    const control = this.authorForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getError(field: string): string {
    const control = this.authorForm.get(field);
    if (control?.errors) {
      if (control.errors["required"])
        return `${this.getFieldLabel(field)} is required`;
      if (control.errors["maxlength"])
        return `${this.getFieldLabel(field)} is too long`;
    }
    return "";
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      name: "Name",
      bio: "Bio",
      nationality: "Nationality",
    };
    return labels[field] || field;
  }
}
