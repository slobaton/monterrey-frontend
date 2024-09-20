import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { parseStringToBool, parseStringToNumber } from 'src/app/@core/helpers/parse-helpers';

export enum ColorSchemeType {
  LIGHT = 'light',
  DARK = 'dark'
}

export const DEFAULT_THEME: string = 'bootstrap4-dark-blue';
export const DEFAULT_COLOR_SCHEME: string = ColorSchemeType.DARK;
export const DEFAULT_SCALE: number = 13;
export const DEFAULT_INPUT_STYLE: string = 'outlined'
export const DEFAULT_MENU_MODE: string = 'static'
export const DEFAULT_RIPPLE: boolean = false

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

export const configStorageKeys = {
  inputStyle: 'config:input-style',
  colorScheme: 'config:color-sheme',
  theme: 'config:theme',
  ripple: 'config:ripple',
  menuMode: 'config:menu-mode',
  scale: 'config:scale'
};

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
    ripple: DEFAULT_RIPPLE,
    inputStyle: DEFAULT_INPUT_STYLE,
    menuMode: DEFAULT_MENU_MODE,
    colorScheme: DEFAULT_COLOR_SCHEME,
    theme: DEFAULT_THEME,
    scale: DEFAULT_SCALE,
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

  constructor() {
    this.loadConfig();
  }

  loadConfig() {
    const storedRipple = localStorage.getItem(configStorageKeys.ripple);
    this.config.ripple = storedRipple ? parseStringToBool(storedRipple) : this.config.ripple;

    const storedInputStyle = localStorage.getItem(configStorageKeys.inputStyle);
    this.config.inputStyle = storedInputStyle ?? this.config.inputStyle;

    const storedMenuMode = localStorage.getItem(configStorageKeys.menuMode);
    this.config.menuMode = storedMenuMode ?? this.config.menuMode;

    const storedColorScheme = localStorage.getItem(configStorageKeys.colorScheme);
    this.config.colorScheme = storedColorScheme ?? this.config.colorScheme;

    const storedTheme = localStorage.getItem(configStorageKeys.theme);
    this.config.theme = storedTheme ?? this.config.theme;

    const storedScale = localStorage.getItem(configStorageKeys.scale);
    this.config.scale = storedScale ? parseStringToNumber(storedScale) : this.config.scale;

    this.onConfigUpdate();
  }

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
    localStorage.setItem(configStorageKeys.ripple, this.config.ripple.toString());
    localStorage.setItem(configStorageKeys.inputStyle, this.config.inputStyle);
    localStorage.setItem(configStorageKeys.menuMode, this.config.menuMode);
    localStorage.setItem(configStorageKeys.theme, this.config.theme);
    localStorage.setItem(configStorageKeys.colorScheme, this.config.colorScheme);
    localStorage.setItem(configStorageKeys.scale, this.config.scale.toString());

    this.configUpdate.next(this.config);
  }

  resetConfig() {
    this.config.ripple = DEFAULT_RIPPLE;
    this.config.inputStyle = DEFAULT_INPUT_STYLE;
    this.config.menuMode = DEFAULT_MENU_MODE;
    this.config.theme = DEFAULT_THEME;
    this.config.colorScheme = DEFAULT_COLOR_SCHEME;
    this.config.scale = DEFAULT_SCALE;

    this.onConfigUpdate();
  }
}
