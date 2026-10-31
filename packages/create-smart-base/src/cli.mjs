export async function run({ prompt, create, install, root }) {
  prompt.intro("Create Smart Base")
  const platforms = await prompt.multiselect({
    message: "What type of website do you want to build? Select one or more.",
    options: [
      { value: "web", label: "Web" },
      { value: "mobile", label: "Mobile" },
    ],
    required: true,
  })
  if (prompt.isCancel(platforms)) {
    prompt.cancel("Cancelled.")
    return 0
  }

  const name = await prompt.text({ message: "What is your project name?", placeholder: "my-app" })
  if (prompt.isCancel(name)) {
    prompt.cancel("Cancelled.")
    return 0
  }

  try {
    const project = await create({ root, name, platforms })
    await install(project)
    prompt.outro(`Project ready. Run: cd ${name} && pnpm dev`)
    return 0
  } catch (error) {
    prompt.log.error(error.message)
    return 1
  }
}
