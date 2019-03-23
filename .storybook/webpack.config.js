module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [{ loader: 'ts-loader' }],
  })
  config.output.globalObject = 'this'
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
