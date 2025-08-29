// 主题生成器模块
export class ThemeGenerator {
    constructor() {
        this.themeColors = {
            'green': '#8ACF01',
            'black': '#000000',
            'white': '#FFFFFF',
            'blue': '#4D90CD'
        };
        
        this.textColors = {
            'green': '#000000',
            'black': '#FFFFFF',
            'white': '#000000',
            'blue': '#FFFFFF'
        };
    }
    
    getThemeColor(theme) {
        return this.themeColors[theme] || this.themeColors.green;
    }
    
    getTextColor(theme) {
        return this.textColors[theme] || this.textColors.green;
    }
    
    isValidTheme(theme) {
        return theme in this.themeColors;
    }
}

export default ThemeGenerator;
