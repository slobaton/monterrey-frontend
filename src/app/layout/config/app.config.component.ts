import { Component, Input } from '@angular/core';
import { availableDarkThemes, availableLightThemes, LayoutService, ThemeConfig } from "../service/app.layout.service";
import { MenuService } from "../app.menu.service";
import { OverlayOptions, SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html'
})
export class AppConfigComponent {

  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];

  selectedTheme: ThemeConfig;

  themeOptions: any[];
  themeSelectorOptions: OverlayOptions = {
    appendTo: 'body',
  };

  constructor(public layoutService: LayoutService, public menuService: MenuService) {
    this.selectedTheme = this.theme;

    this.themeOptions = [
      {
        name: 'Temas Claros',
        themes: availableLightThemes
      },
      {
        name: 'Temas Oscuros',
        themes: availableDarkThemes
      }
    ]
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.layoutService.config.scale = _val;
  }

  get menuMode(): string {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: string) {
    this.layoutService.config.menuMode = _val;
  }

  get inputStyle(): string {
    return this.layoutService.config.inputStyle;
  }

  set inputStyle(_val: string) {
    this.layoutService.config.inputStyle = _val;
  }

  get ripple(): boolean {
    return this.layoutService.config.ripple;
  }

  set ripple(_val: boolean) {
    this.layoutService.config.ripple = _val;
  }

  get theme(): ThemeConfig {
    const themes = availableLightThemes.concat(...availableDarkThemes);

    const selectedTheme = this.layoutService.config.theme;
    const selectedColorScheme = this.layoutService.config.colorScheme;

    const selectedConfig = themes.find(t => t.theme === selectedTheme && t.colorScheme === selectedColorScheme);

    return {
      name: selectedConfig?.name ?? '',
      theme: selectedConfig?.theme ?? '',
      colorScheme: selectedConfig?.colorScheme ?? ''
    };
  }

  set theme(_val: ThemeConfig) {
    this.layoutService.config.theme = _val.theme;
    this.layoutService.config.colorScheme = _val.colorScheme;
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  onChangeTheme() {
    this.changeTheme(this.selectedTheme.theme, this.selectedTheme.colorScheme);
  }

  changeTheme(theme: string, colorScheme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.layoutService.config.colorScheme
    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.theme = theme;
      this.layoutService.config.colorScheme = colorScheme;
      this.layoutService.onConfigUpdate();
    });
  }

  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }
}
