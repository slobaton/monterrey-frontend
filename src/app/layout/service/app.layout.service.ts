import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ColorSchemeType {
  LIGHT = 'light',
  DARK = 'dark'
}

const DEFAULT_THEME: string = 'bootstrap4-dark-blue';
const DEFAULT_COLOR_SCHEME: string = ColorSchemeType.DARK;

export type ThemeConfig = {
  name: string,
  theme: string,
  colorScheme: string
};

export const availableLightThemes: ThemeConfig[] = [
  {
    name: 'Azul Tipo 1',
    theme: 'bootstrap4-light-blue',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Azul Tipo 2',
    theme: 'lara-light-blue',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Azul Tipo 3',
    theme: 'saga-blue',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Purpura Tipo 1',
    theme: 'bootstrap4-light-purple',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Purpura Tipo 2',
    theme: 'md-light-deeppurple',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Purpura Tipo 3',
    theme: 'mdc-light-deeppurple',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Purpura Tipo 4',
    theme: 'lara-light-purple',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Purpura Tipo 5',
    theme: 'saga-purple',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Indigo Tipo 1',
    theme: 'md-light-indigo',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Indigo Tipo 2',
    theme: 'mdc-light-indigo',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Indigo Tipo 3',
    theme: 'lara-light-indigo',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Aqua Tipo 1',
    theme: 'tailwind-light',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Aqua Tipo 2',
    theme: 'tailwind-light',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Verde Tipo 1',
    theme: 'saga-green',
    colorScheme: ColorSchemeType.LIGHT
  },
  {
    name: 'Naranja Tipo 1',
    theme: 'saga-orange',
    colorScheme: ColorSchemeType.LIGHT
  },
];

export const availableDarkThemes: ThemeConfig[] = [
  {
    name: 'Azul Tipo 1',
    theme: 'bootstrap4-dark-blue',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Azul Tipo 2',
    theme: 'lara-dark-blue',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Azul Tipo 3',
    theme: 'vela-blue',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Azul Tipo 4',
    theme: 'arya-blue',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Purpura Tipo 1',
    theme: 'bootstrap4-dark-purple',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Purpura Tipo 2',
    theme: 'md-dark-deeppurple',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Purpura Tipo 3',
    theme: 'mdc-dark-deeppurple',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Purpura Tipo 4',
    theme: 'lara-dark-purple',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Purpura Tipo 5',
    theme: 'vela-purple',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Purpura Tipo 6',
    theme: 'arya-purple',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Indigo Tipo 1',
    theme: 'md-dark-indigo',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Indigo Tipo 2',
    theme: 'mdc-dark-indigo',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Indigo Tipo 3',
    theme: 'lara-dark-indigo',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Aqua Tipo 1',
    theme: 'lara-dark-teal',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Verde Tipo 1',
    theme: 'vela-green',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Verde Tipo 2',
    theme: 'arya-green',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Naranja Tipo 1',
    theme: 'vela-orange',
    colorScheme: ColorSchemeType.DARK
  },
  {
    name: 'Naranja Tipo 2',
    theme: 'arya-orange',
    colorScheme: ColorSchemeType.DARK
  }
];

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: DEFAULT_COLOR_SCHEME,
    theme: DEFAULT_THEME,
    scale: 13,
  };

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  };

  private configUpdate = new Subject<AppConfig>();

  private overlayOpen = new Subject<any>();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;
      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
    }
    else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
      this.overlayOpen.next(null);
    }
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  isOverlay() {
    return this.config.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this.configUpdate.next(this.config);
  }

}
