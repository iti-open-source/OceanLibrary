import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import {
  LucideAngularModule,
  Home,
  Book,
  Users,
  Compass,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  CalendarCheck,
  MessagesSquare,
  Eye,
} from "lucide-angular";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home,
        Book,
        Users,
        Compass,
        Search,
        Menu,
        X,
        ChevronDown,
        ChevronUp,
        User,
        LogOut,
        CalendarCheck,
        MessagesSquare,
        Eye,
      })
    ),
  ],
};
