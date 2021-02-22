module.exports = {
  parser: '@typescript-eslint/parser', //定义ESLint的解析器
  extends: ['plugin:@typescript-eslint/recommended'], //定义文件继承的子规范，官方推荐规则
  plugins: ['@typescript-eslint'], //定义了该eslint文件所依赖的插件
  parserOptions: {
    project: './tsconfig.json' // 类型信息
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off' // 关闭类型推断
  },
  env: {
    //指定代码的运行环境
    browser: true,
    node: true
  }
}
