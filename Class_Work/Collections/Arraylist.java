package Collections;
import java.util.*;
public class Arraylist {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);
        numbers.add(50);
        numbers.add(60);
        numbers.add(70);
        numbers.add(80);
        numbers.add(90);
        numbers.add(100);

        numbers.set(1, 25);
        numbers.set(7, 85);

        System.out.println("Updated elements: " + numbers.get(1) + ", " + numbers.get(7));
        System.out.println("All elements: " + numbers);
    }
}
