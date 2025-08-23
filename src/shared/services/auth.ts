import { supabase } from './client';
import { UserRegistrationData } from '../types';

// 회원가입 함수: Supabase Auth를 이용해 새 사용자를 등록한다.
export async function signUp(userData: UserRegistrationData) {
  alert('👉 cohort 값 확인\n' + '타입: ' + typeof userData.cohort + '\n' + '값: ' + userData.cohort);

  try {
    // Supabase Auth의 signUp 메서드 호출
    // 이메일, 비밀번호, 그리고 메타데이터(options.data)를 함께 전달한다.
    const { data, error } = await supabase.auth.signUp({
      email: userData.email, // 사용자 이메일

      password: userData.password, // 사용자 비밀번호
      options: {
        emailRedirectTo: window.location.origin, // 회원가입 후 이메일 인증 링크 클릭 시 돌아올 URL
        data: {
          // raw_user_meta_data 로 저장될 사용자 메타데이터
          user_id: userData.userId, // 서비스 내부 고유 아이디
          nickname: userData.nickname, // 닉네임
          name: userData.name, // 실명
          full_name: userData.name, // 실명 (full_name 에도 저장)
          cohort: userData.cohort, // 신청 기수 (숫자로 보내야 안전)
          user_type: 'student', // 기본 역할: 학생 (user_type 사용)
          status: 'pending', // 기본 상태: 대기(pending)
        },
      },
    });

    // 만약 회원가입 중 error가 발생했다면 예외를 던진다.
    if (error) throw error;

    // data.user가 비어있다면 사용자 생성이 되지 않은 상태 → 오류 처리
    if (!data.user) throw new Error('사용자 생성 실패');

    // 회원가입이 정상적으로 성공했을 경우 사용자 ID를 로그로 출력
    console.log('회원가입 성공:', data.user.id);

    // 성공적으로 생성된 data를 반환, error는 null
    return { data, error: null };
  } catch (error: unknown) {
    // try 블록 내에서 발생한 모든 오류를 잡아 콘솔에 출력
    console.error('회원가입 오류:', error);

    // 실패 시 data는 null, error는 실제 오류 객체를 반환
    return { data: null, error };
  }
}

// 로그인 (아이디 또는 이메일로 로그인)
export async function signIn(emailOrUserId: string, password: string) {
  console.log('👉 signIn 함수 호출됨');
  console.log('👉 입력된 emailOrUserId:', emailOrUserId);

  try {
    let email = emailOrUserId;
    let isIdLogin = false;

    // @ 가 없으면 user_id로 간주하고 이메일 찾기
    if (!emailOrUserId.includes('@')) {
      isIdLogin = true;
      console.log('아이디로 로그인 시도:', emailOrUserId);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, user_id')
        .eq('user_id', emailOrUserId)
        .single();

      console.log('프로필 조회 결과:', { profile, profileError });

      if (profileError) {
        console.error('프로필 조회 실패:', profileError);
        if (profileError.code === 'PGRST116') {
          throw new Error('존재하지 않는 아이디입니다.');
        } else {
          throw new Error(`프로필 조회 중 오류: ${profileError.message}`);
        }
      }

      if (!profile || !profile.email) {
        throw new Error('해당 아이디에 연결된 이메일을 찾을 수 없습니다.');
      }

      email = profile.email;
      console.log('찾은 이메일:', email);
    } else {
      console.log('이메일로 로그인 시도:', emailOrUserId);
    }

    console.log('최종 로그인 시도할 이메일:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Supabase Auth 응답:', {
      user: data?.user ? 'User found' : 'No user',
      error: error ? error.message : 'No error',
    });

    if (error) {
      console.error('로그인 에러 상세:', error);

      // 더 구체적인 오류 메시지 제공
      if (error.message.includes('Invalid login credentials')) {
        if (isIdLogin) {
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.');
      } else {
        throw new Error(`로그인 실패: ${error.message}`);
      }
    }

    if (!data.user) {
      throw new Error('로그인 처리 중 오류가 발생했습니다.');
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('로그인 오류:', error);
    return { data: null, error };
  }
}

// 로그아웃
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { error };
  }
}

// 현재 사용자 가져오기
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return { user: null, error };
  }
}
