let navigateFunction: any = null

export const setNavigateFunction = (navigate: any) => {
  navigateFunction = navigate
}

export const navigateTo = (path: any) => {
  if (navigateFunction) {
    navigateFunction(path)
  }
}
