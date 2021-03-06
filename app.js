const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const handlebars = require("handlebars");

// promts user to enter team structure

function promptTeamInfo (){

    return inquirer
      .prompt([
        {
            name: "name", 
            message: "Enter the Employee's name: ",
            type: "input",
            validate: (input) => {
                if(input === ""){
                    return "Employee name is required."
                }
                return true;
            }
            
        },
    
        {   
            name: "id",
            message: "Enter the Employee's id: ",
            type: "input",
  
        },

        {
            name: "email",
            message: "Enter the Employee's email: ",
            type: "input",
            validate: (input) => {
                if(input === ""){
                    return "A valid email is required."
                }
                return true;
            }
        },
        {
            message: "Enter the Employee's role: ",
            name: "role"
            
        },
        {
            message: "Enter the Manager's office number: ",
            name: "office",
            when: (answers) => (answers.role).toLowerCase() === "manager"

        },
        {
            message: "Enter the Intern's school: ",
            name: "school",
            when: (answers) => (answers.role).toLowerCase() === "intern"

        },

        {
            
            name: "github",
            message: "Enter the Engineer's github username: ",
            type: "input",
            validate: (input) => {
                if(input === ""){
                    return "School name is required"
                }
                return true;
            },
            when: (answers) => (answers.role).toLowerCase() === "engineer"

        },

        {
            
            name: "more",
            message: "Would you like to enter another team member?",

        }
    ]);
}


async function employeeInfo (){
    var moreEmployees = "yes";
    fs.copyFileSync('./templates/main.html', './output.html');
    console.log("Let's build your team! Output will be saved in output.html")

    while (moreEmployees != "no") {
        const answers = await promptTeamInfo();
        var e1 = new Employee(answers.name, answers.id, answers.email, answers.role);
        if ((answers.role).toLowerCase() == "manager"){
            //create object of class Manager
            const m1 = new Manager(answers.name, answers.id, answers.email, answers.office);
            const create =  await createEmployeeCard(m1, answers.more);

        } else if((answers.role).toLowerCase() == "engineer"){
           //create object of class engineer 
           const eg1 = new Engineer(answers.name, answers.id, answers.email, answers.github);
           const create = await createEmployeeCard(eg1, answers.more);

        } else if((answers.role).toLowerCase() == "intern"){
            //create object of class intern
            const i1 = new Intern(answers.name, answers.id, answers.email, answers.school);
            const create = await createEmployeeCard(i1, answers.more);

        }
        moreEmployees = answers.more;
        if (moreEmployees == "no") {
            //append text....Dont remove this if condition
        }
    }    
}

//this function reads the templates, updates the employees informatin and renders cards in "output.html"

async function createEmployeeCard (employeeInfo, more) {
    var employeeRole = (employeeInfo.title).toLowerCase();
    var fileName = "./templates/" + employeeRole + ".html";
    let content;
    fs.readFile(fileName, function (err, data){
        if(err){
            throw err;
        }
        content = data.toString();
        var template = handlebars.compile(content);
        var html = template(employeeInfo);
        fs.appendFile('./output.html', html, function(err){
            if(err) {
                throw err
            } else if(more == "no"){
                //appendfooter if no more employees to add
                var footerhtml = "</div></div></body></html>";
                fs.appendFile('./output.html', footerhtml, function(err){
                    if(err) {
                        throw err;
                    } else {
                     console.log("Team roster created and saved in the output.html, please check!!");
                    }
                })
            }
        })
        

    });
    return "create card done";
}

employeeInfo();
