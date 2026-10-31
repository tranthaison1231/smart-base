export async function installProject({ cwd, spawn }) {
  for (const command of ["install", "format"]) {
    await new Promise((resolve, reject) => {
      const child = spawn("pnpm", [command], { cwd, stdio: "inherit" })
      child.once("error", () =>
        reject(new Error(`Could not run pnpm in ${cwd}. Install pnpm and run pnpm ${command}.`)),
      )
      child.once("exit", (code) => {
        if (code === 0) resolve()
        else reject(new Error(`pnpm ${command} failed. Run it again in ${cwd}.`))
      })
    })
  }
}
