import { cond, equals, F, isNil, T } from 'ramda'

export const ROLE_USER = 'ROLE_USER'
export const ROLE_EDITOR = 'ROLE_EDITOR'
export const ROLE_FREELANCE_WRITER = 'ROLE_FREELANCE_WRITER'
export const ROLE_EDITOR_IN_CHIEF_LANG = 'ROLE_EDITOR_IN_CHIEF_LANG'
export const ROLE_EDITOR_IN_CHIEF = 'ROLE_EDITOR_IN_CHIEF'
export const ROLE_MARKETING = 'ROLE_MARKETING'
export const ROLE_ADMIN = 'ROLE_ADMIN'
export const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN'

// isUser :: User -> Boolean
const isUser = user =>
  !isNil(user)
  && !isNil(user.role)

// isEditor :: User -> Boolean
export const isEditor = user =>
  isUser(user)
  && [ROLE_EDITOR, ROLE_ADMIN, ROLE_SUPER_ADMIN].includes(user.role)

// isAdmin :: User -> Boolean
export const isAdmin = user =>
  isUser(user)
  && [ROLE_ADMIN, ROLE_SUPER_ADMIN].includes(user.role)

// isGranted :: (User, String) -> Boolean
export const isGranted = (user, level) =>
  !isNil(user)
  && !isNil(user.role)
  && cond([
    [equals(ROLE_EDITOR), () => isEditor(user)],
    [equals(ROLE_ADMIN), () => isAdmin(user)],
    [T, F],
  ])(level)
