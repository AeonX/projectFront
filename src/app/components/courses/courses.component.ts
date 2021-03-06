import { Component, OnInit, ElementRef, ViewChild, Input, NgZone, OnChanges } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk';
import { UserService } from 'src/app/service/user.service';
import { courseDto, UserDtos } from 'src/app/model/backend.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})

export class CoursesComponent implements OnInit,OnChanges {

  courseForm: FormGroup;
  courses: any[] = [];
  isDropOver: boolean;
  isCreateCourse: boolean = false;
  userId: number = 1;
  error: string;
  image: any;
  user = sessionStorage.getItem('username');
  currentUser: any;
  isLoading: boolean = false;
  imgSize: number = 0;
  canSaveCourse: number = 0;

  course: courseDto = {
    id: null,
    coursename: null,
    description: null,
    img_url: null,
    userEntity: null
  }

  userDto: UserDtos = {
    user_id: parseInt(sessionStorage.getItem('user_id'))
  }

  constructor(private router: Router, private courseService: CourseService, private userService: UserService) {
  }

  ngOnInit() {
    this.courseService.findAllCourses().subscribe(courses => {
      courses.filter(result => {
        if (this.userDto.user_id === result.userEntity.user_id) {
          this.courses.push(result);
        }
      })
    });

    this.courseForm = new FormGroup({
      coursename: new FormControl('Please enter a course name.', [Validators.required]),
      description: new FormControl('Please enter a description.', [Validators.required])
    });
  }

  ngOnChanges(): void {}

  onSubmit(): void {}

  closeModal() {
    //prepare data
    this.course.coursename = this.courseForm.value['coursename'];
    this.course.description = this.courseForm.value['description'];
    this.course.userEntity = {
      user_id: this.userDto.user_id
    }
    this.courseService.save(this.course).subscribe(result => { });

    
    this.gotoUserList();
  }

  gotoUserList() {
    this.router.navigate(['/createModule']);
  }

  onClickCreateCourse(): void {
    this.isCreateCourse = true;
  }

  fileEvent(fileInput: any) {
    this.isLoading = true;
    const AWSService = AWS;
    const region = 'eu-central-1';
    const bucketName = 'webify';
    const IdentityPoolId = 'eu-central-1:8e7c4ec1-e682-471a-ae89-3a06e8977b18';
    const file = fileInput.target.files[0];
    let saveUrl;

    //Configures the AWS service and initial authorization
    AWSService.config.update({
      region: region,
      credentials: new AWSService.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });

    //adds the S3 service, make sure the api version and bucket are correct
    const s3 = new AWSService.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: bucketName }
    });
    //I store this in a variable for retrieval later
    this.image = file.name;
    s3.upload({ Key: file.name, Bucket: bucketName, Body: file, ACL: 'public-read' }, (err, data) => {
      this.isLoading = false;
      this.course.img_url = data.Location;
      if (err) {
        console.log(err, 'there was an error uploading your file');
      }
    }).on('httpUploadProgress', element => {
      //put progress bar to 100 when upload is complete
      this.imgSize = 100;
      //change canSaveCourse to 1 when image is uploaded to be able to save 
      this.canSaveCourse = 1;
    })
  }

}
