import * as Security from './Security'

describe('Security', () => {
  it('indicates whether the given user is an editor or not', () => {
    expect(Security.isEditor()).toBe(false);
    expect(Security.isEditor(true)).toBe(false);
    expect(Security.isEditor({
      role: 'ROLE_USER',
    })).toBe(false);

    expect(Security.isEditor({
      role: 'ROLE_EDITOR',
    })).toBe(true);
    expect(Security.isEditor({
      role: 'ROLE_ADMIN',
    })).toBe(true);
    expect(Security.isEditor({
      role: 'ROLE_SUPER_ADMIN',
    })).toBe(true);
  });

  it('indicates whether the given user is an admin or not', () => {
    expect(Security.isAdmin()).toBe(false);
    expect(Security.isAdmin(true)).toBe(false);
    expect(Security.isAdmin({
      role: 'ROLE_EDITOR',
    })).toBe(false);

    expect(Security.isAdmin({
      role: 'ROLE_ADMIN',
    })).toBe(true);
    expect(Security.isAdmin({
      role: 'ROLE_SUPER_ADMIN',
    })).toBe(true);
  });

  it('indicates whether the user is granted for editor access or not', () => {
    expect(Security.isGranted(undefined, 'ROLE_EDITOR')).toBe(false)
    expect(Security.isGranted(true, 'ROLE_EDITOR')).toBe(false)
    expect(Security.isGranted({role: 'ROLE_USER'}, 'ROLE_EDITOR')).toBe(false)

    expect(Security.isGranted({role: 'ROLE_EDITOR'}, 'ROLE_EDITOR')).toBe(true)
    expect(Security.isGranted({role: 'ROLE_ADMIN'}, 'ROLE_EDITOR')).toBe(true)
    expect(Security.isGranted({role: 'ROLE_SUPER_ADMIN'}, 'ROLE_EDITOR')).toBe(true)
  })

  it('indicates whether the user is granted for admin access or not', () => {
    expect(Security.isGranted(undefined, 'ROLE_ADMIN')).toBe(false)
    expect(Security.isGranted(true, 'ROLE_ADMIN')).toBe(false)
    expect(Security.isGranted({role: 'ROLE_EDITOR'}, 'ROLE_ADMIN')).toBe(false)

    expect(Security.isGranted({role: 'ROLE_ADMIN'}, 'ROLE_ADMIN')).toBe(true)
    expect(Security.isGranted({role: 'ROLE_SUPER_ADMIN'}, 'ROLE_ADMIN')).toBe(true)
  })

  it('should not grant access for an unsupported role', () => {
    expect(Security.isGranted({role: 'ROLE_SUPER_ADMIN'}, 'UNSUPPORTED')).toBe(false)
  })
});
