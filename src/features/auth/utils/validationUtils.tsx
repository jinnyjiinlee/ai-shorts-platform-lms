interface ValidationErrors {
  userId?: string;
  nickname?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
}

export class ValidationUtils {
  static validateUserId(userId: string): string | null {
    if (!userId) return '아이디를 입력해주세요.';
    if (userId.length < 4) return '아이디는 4자 이상이어야 합니다.';
    if (userId.length > 20) return '아이디는 20자 이하여야 합니다.';
    if (!/^[a-zA-Z0-9_]+$/.test(userId)) return '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.';
    return null;
  }

  static validateNickname(nickname: string): string | null {
    if (!nickname) return '닉네임을 입력해주세요.';
    if (nickname.length < 2) return '닉네임은 2자 이상이어야 합니다.';
    if (nickname.length > 15) return '닉네임은 15자 이하여야 합니다.';
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.';
    }
    return null;
  }

  static validateConfirmPassword(password: string, confirmPassword: string): string | null {
    if (!confirmPassword) return '비밀번호 확인을 입력해주세요.';
    if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.';
    return null;
  }

  static validateEmail(email: string): string | null {
    if (!email) return '이메일을 입력해주세요.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.';
    return null;
  }

  static validateForm(formData: {
    userId: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    email: string;
  }): ValidationErrors {
    const errors: ValidationErrors = {};

    const userIdError = this.validateUserId(formData.userId);
    if (userIdError) errors.userId = userIdError;

    const nicknameError = this.validateNickname(formData.nickname);
    if (nicknameError) errors.nickname = nicknameError;

    const passwordError = this.validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = this.validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    return errors;
  }

  static async checkDuplicateUserId(userId: string): Promise<boolean> {
    // 실제로는 서버 API 호출
    // 시뮬레이션: 'admin', 'test' 등은 중복으로 처리
    return new Promise((resolve) => {
      setTimeout(() => {
        const duplicateIds = ['admin', 'test', 'user', 'root'];
        resolve(duplicateIds.includes(userId.toLowerCase()));
      }, 1000);
    });
  }

  static async checkDuplicateNickname(nickname: string): Promise<boolean> {
    // 실제로는 서버 API 호출
    return new Promise((resolve) => {
      setTimeout(() => {
        const duplicateNicknames = ['관리자', '테스트', 'admin'];
        resolve(duplicateNicknames.includes(nickname));
      }, 1000);
    });
  }
}