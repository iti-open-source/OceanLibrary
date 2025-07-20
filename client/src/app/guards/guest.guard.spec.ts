import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { GuestGuard } from "./guest.guard";
import { AuthService } from "../services/auth.service";

describe("GuestGuard", () => {
  let guard: GuestGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj("AuthService", ["isLoggedIn"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(GuestGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should allow access when user is not logged in", () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("should deny access and redirect when user is logged in", () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });
});
