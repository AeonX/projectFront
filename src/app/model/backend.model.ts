export interface RoleDto {
    role_id: number,
    role_name: string;
}

export interface UserDto {
    user_id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    pwd: string;
    role: RoleDto;
}

export interface UserDtos {
    user_id: number;
}

export interface courseDto {
    course_id: number;
    course_name: string;
    description: string;
    created_on: string;
    img_url: string;
    user: UserDtos;
}

export interface moduleDto {
    module_id: number;
    module_name: string;
    module_code: string;
    description: string;
    course: courseDto;
}

export interface lectureDto {
    lecture_id: number;
    lecture_name: string;
    description: string;
    video_url: string;
    module: moduleDto;
    courseLecture: courseDto;
}

export interface quizDto{
    quiz_id: number;
    quiz_name: string;
    moduleQuiz: moduleDto;
    courseQuiz: courseDto;
}

export interface quizQuestionDto extends quizDto{
    quiz_question_id: number;
    question: string;
}

export interface quizAnswerDto extends quizQuestionDto{
    quiz_answer_id: number;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
}