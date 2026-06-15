import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const configDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(configDir, '..')

const modules = [
  '00-快速入门',
  '01-政策与证书',
  '02-报考条件',
  '03-培训课程',
  '04-考试指南',
  '05-报名流程',
  '06-补贴申请',
  '07-证书查询',
  '08-职业发展',
  '09-地区指南',
  '10-备考资源'
]

function readTitle(filePath: string) {
  const content = readFileSync(filePath, 'utf8')
  const frontmatterTitle = content.match(/^---[\s\S]*?\ntitle:\s*["']?([^"'\n]+)["']?[\s\S]*?\n---/)
  if (frontmatterTitle?.[1]) return frontmatterTitle[1].trim()

  const heading = content.match(/^#\s+(.+)$/m)
  if (heading?.[1]) return heading[1].trim()

  return filePath
    .split('/')
    .pop()!
    .replace(/\.md$/, '')
    .replace(/-/g, ' ')
}

function sidebarItems(moduleName: string) {
  const modulePath = join(rootDir, moduleName)
  const files = readdirSync(modulePath)
    .filter((file) => file.endsWith('.md'))
    .filter((file) => file !== 'index.md')
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

  return [
    {
      text: readTitle(join(modulePath, 'index.md')),
      link: `/${moduleName}/`
    },
    ...files.map((file) => ({
      text: readTitle(join(modulePath, file)),
      link: `/${moduleName}/${file.replace(/\.md$/, '')}`
    }))
  ]
}

const sidebar = Object.fromEntries(
  modules
    .filter((moduleName) => statSync(join(rootDir, moduleName)).isDirectory())
    .map((moduleName) => [
      `/${moduleName}/`,
      [
        {
          text: moduleName.replace(/^\d+-/, ''),
          items: sidebarItems(moduleName)
        }
      ]
    ])
)

export default defineConfig({
  title: '企业人力资源管理师职业技能等级考试招生知识库',
  description: '政策解读、报考条件、培训课程、考试指南、证书查询、补贴申请',
  lang: 'zh-CN',
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['internal/**', 'README.md', 'CHANGELOG.md', 'CONTRIBUTING.md'],
  themeConfig: {
    logo: undefined,
    siteTitle: '招生知识库',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速入门', link: '/00-快速入门/' },
      { text: '报考条件', link: '/02-报考条件/' },
      { text: '报名流程', link: '/05-报名流程/' },
      { text: '补贴申请', link: '/06-补贴申请/' },
      { text: '备考资源', link: '/10-备考资源/' }
    ],
    sidebar,
    search: {
      provider: 'local'
    },
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    }
  }
})
