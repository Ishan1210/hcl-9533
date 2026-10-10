package Collections;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Student {
    private final String name;
    private final int rollno;
    private final int age;
    private final double marks;

    Student(String name, int rollno, int age, double marks) {
        this.name = name;
        this.rollno = rollno;
        this.age = age;
        this.marks = marks;
    }

    int getAge() {
        return age;
    }

    double getMarks() {
        return marks;
    }

    @Override
    public String toString() {
        return "Student{name='" + name + "', rollno=" + rollno
                + ", age=" + age + ", marks=" + marks + "}";
    }
}

public class MapTask1 {
    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("Aarav", 101, 20, 85.5));
        students.add(new Student("Diya", 102, 19, 91.0));
        students.add(new Student("Ishaan", 103, 21, 78.5));
        students.add(new Student("Meera", 104, 20, 88.0));
        students.add(new Student("Kabir", 105, 18, 94.5));
        students.add(new Student("Anaya", 106, 22, 81.0));
        students.add(new Student("Rohan", 107, 19, 86.5));
        students.add(new Student("Sara", 108, 21, 90.0));
        students.add(new Student("Vivaan", 109, 18, 79.5));
        students.add(new Student("Ira", 110, 20, 92.0));

        System.out.println("Students in insertion order:");
        printStudents(students);

        List<Student> sortedByAge = new ArrayList<>(students);
        sortedByAge.sort(Comparator.comparingInt(Student::getAge)
                .thenComparingDouble(Student::getMarks));
        System.out.println("\nStudents sorted by age (marks break age ties):");
        printStudents(sortedByAge);

        List<Student> sortedByMarks = new ArrayList<>(students);
        sortedByMarks.sort(Comparator.comparingDouble(Student::getMarks)
                .reversed());
        System.out.println("\nStudents sorted by marks (highest first):");
        printStudents(sortedByMarks);
    }

    private static void printStudents(List<Student> students) {
        for (Student student : students) {
            System.out.println(student);
        }
    }
}
