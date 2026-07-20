import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { ExamResult } from "@/models/exam.model";
import { Student } from "@/models";


export async function GET(request: NextRequest){
    try {
        await Connect();

        const PassedExamResult = await ExamResult.find({examResult: "passed", examPublishedStatus: "published"});
        const TotalExamResult = await ExamResult.find({examPublishedStatus: "published"});
        const TotalPassPercentage = (PassedExamResult.length / TotalExamResult.length) * 100;
        const FailedExamResult = await ExamResult.find({examResult: "failed", examPublishedStatus: "published"}).select("studentId");
        

        // for (const Exam of TotalExamResult){
            const resultByDepartment = await ExamResult.aggregate([
                {
                    $match: {
                        examPublishedStatus: "published"
                    }
                },
                {
                    $lookup: {
                        from : "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "studentData"
                    }
                },
                {
                    $unwind: "$studentData"
                },
                {
                    $group: {
                        _id: "$studentData.department",
                        // averageScore: {
                        //     $avg: "$score"
                        // },
                        // passedCount: { $sum: 1},
                        totalExamsTaken: { $sum: 1 },
                        passedExam: {
                            $sum : {
                                $cond : [
                                    {
                                        $eq: ["$examResult", "passed"]
                                    },
                                    1,
                                    0
                                ]
                                
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        department: "$_id", 
                        // averageScore: {
                        //     $round: 
                        //         [
                        //             "$averageScore",
                        //             2
                        //         ]
                            
                        // },

                        totalExamTaken: 1,
                        passPercentage: {
                            $round: [
                                {$multiply: [{$divide: ["$passedExam", "totalExamTaken"]}, 100]},
                                2
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        passPercentage: -1
                    }
                }
            ])

            const TotalnumberOfStudentsPerDeptOnly = await Student.aggregate([
                { 
                  
                  $match: { status: "active" } 
                },
                { 
                  
                  $group: { 
                    _id: { 
                      department: "$department", 
                       
                    }, 
                    totalStudents: { $sum: 1 } 
                  } 
                },
                { 
                  
                  $project: { 
                    _id: 0, 
                    department: "$_id.department", 
                    
                    totalStudents: 1 
                  } 
                },
                
              ]);
              
            // const department = await Subject.find({dep.studentId.department})
        // }


    } catch (error) {
        
    }
}