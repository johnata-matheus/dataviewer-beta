import { Injectable } from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassListDto } from "./dto/get-class-list.dto";
import { ClassDto } from "./dto/get-class.dto";
import { ListSubjectClassDto } from "./dto/get-list-subjects.dto";
import { ClassDocument, TClass } from "./schemas/class.schema";
import { ClassListDocument, ClassList } from "./schemas/classlist.schema";
import { ListSubjectClass, ListSubjectClassDocument } from "./schemas/listsubjectclass.schema";
import { TeacherClass, TeacherClassDocument } from "./schemas/teacherclass.schema";

@Injectable({})
export class ClassesService {
  constructor(
    @InjectModel(TClass.name) private readonly classModel: Model<ClassDocument>, 
    @InjectModel(TeacherClass.name) private readonly teacherClassModel: Model<TeacherClassDocument>,
    @InjectModel(ListSubjectClass.name) private readonly listSubjectClass: Model<ListSubjectClassDocument>,
    @InjectModel(ClassList.name) private readonly classListModel: Model<ClassListDocument>  
  ) {}

  async findTeacherClasses(userEmail: string): Promise<ClassDto[]> {    
    const teacherClassData = await this.teacherClassModel.findOne( {email: userEmail} ).exec() 
    //console.log(teacherClassData['classes']) 
    const classIds = teacherClassData['classes'] 
    return this.classModel.find( { class_id: {$in : classIds }} ).exec() 
  }

  async findOne(id: string): Promise<ClassDto> {
    return this.classModel.findOne( {class_id: id} ).exec() 
  }

  async findListSubjectClass(id: string): Promise<ListSubjectClassDto[]> {
    // Realiza tratamento de exceção 
    const data  = await this.listSubjectClass.findOne( {class_id: id} ).exec() 

    return data['tags'].map((l) => ({      
      fullName: l.subject,
      name: l.subject,   
      acertos: l.qt_acertos,
      erros: l.qt_erros,
      restantes: l.qt_nao_fez, 
    }));

  }

  async findClassLists(id: string): Promise<ClassListDto[]> {
    // Realiza tratamento de exceção 
    const data  = await this.classListModel.findOne( {class_id: id} ).exec() 

    if (! data )
      return []; 
    return data.lists.map((l) => ({      
      fullName: l.description,
      name: l.description,   
      acertos: l.qt_acertos,
      erros: l.qt_erros,
      restantes: l.qt_nao_fez, 
    })); 

  }
}