---
title: New Developer Features Since JDK8 to 17
date: '2022-01-08'
tags: ['Java', 'JDK17']
draft: false
summary: 'Here are some highlights of the new features introduce for JDK8 onward.'
---

Reference:

[A categorized list of all Java and JVM features since JDK 8 to 18]([A categorized list of all Java and JVM features since JDK 8 to 18 - Advanced Web Machinery](https://advancedweb.hu/a-categorized-list-of-all-java-and-jvm-features-since-jdk-8-to-18/))

full list of JDK Enhancement Proposals: [OpenJDK "JEPs in JDK 17 integrated since JDK 11"](https://openjdk.java.net/projects/jdk/17/jeps-since-jdk-11).

[New Features in Java11](https://www.baeldung.com/java-11-new-features)

## Highlights for JDK from 11 to 17

### Text Blocks

[JEP 378: Text Blocks](https://openjdk.java.net/jeps/378)

Example:

```java
// BEFORE
String oldBlock =     "This is the old way\n"
    + "of doing multi-line\n"
    + "strings.";
// AFTER
String newBlock = """
    This is the new way
    of doing multi-line
    strings.
    """;
```

### Switch Expressions

[JEP 361: Switch Expressions](https://openjdk.java.net/jeps/361)

For an in-depth example, see [entry on Switch Expressions](https://dzone.com/articles/whats-new-between-java-11-and-java-17#:~:text=3.-,Switch%20Expressions,-Switch%20Expressions%20will).

With switch expressions support, developers can now streamline their switch blocks by omitting the `break` statements.

```java
private static void withReturnValueEvenShorter(Fruit fruit) {
    System.out.println(
        switch (fruit) {
            case APPLE, PEAR -> "Common fruit";
            case ORANGE, AVOCADO -> "Exotic fruit";
            default -> "Undefined fruit";
        });
}
```

### Records

[JEP 395: Records](https://openjdk.java.net/jeps/395)

For an in-depth example, see [entry on Records](https://dzone.com/articles/whats-new-between-java-11-and-java-17#:~:text=4.-,Records,-Records%20will%20allow).

Records will allow you to create immutable data classes. Currently you need to create a class using the autogenerate functions of your IDE to generate constructor, getters, `hashCode`, `equals` and `toString` you need to write your own getter, setter, or use  [Lombok](https://mydeveloperplanet.com/2018/05/02/project-lombok-reduce-boilerplate-code/) for this purpose.

```java
// BEFORE
public class Article {
    private String title;
    private String content;
    private Long authorId;
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public Long getAuthorId() {
        return authorId;
    }
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
}

// AFTER
// the above class definition could be replaced with the following
public record Article(String title, String content, Long authorId) {
}
```

### Sealed Classes

[JEP 409: Sealed Classes](https://openjdk.java.net/jeps/409)

For an in-depth article, see [Oracle's "Fight ambiguity and improve your code with Java 17's sealed classes"](https://blogs.oracle.com/javamagazine/post/java-sealed-classes-fight-ambiguity).

Sealed classes can restrict inheritance and extensibility thatttt gives developers an additional tool when designing class hierarchies.

```java
// Example of a three-layer inheritance 
public class Hero {

}

// TankHero interface
public class TankHero extends Hero {

}

// AttachHero interface
public class AttackHero extends Hero {

}

// SupportHero interface
public class SupportHero extends Hero {

}

// TankHero definition
public class Alistar extends TankHero {

}

// AttachHero definition
public class Ezreal extends AttackHero {

}

// SupportHero definition
public class Soraka extends SupportHero {

}
```

![](https://segmentfault.com/img/bVcZysz)

If we want to restrict the inheritance of Hero class as only permit these three interface (TankHero, AttackHero, SupportHero), we can use a sealed class:

```java
public sealed class Hero permits TankHero, AttackHero, SupportHero {
}
```

The child class of the sealed class can either choose to define `sealed` (only permit inheritance to restricted class), `non-sealed`   (can be inherited without restriction), `final` (cannot be inherited).

```java
// if we allow to increase different heros from tankHero interface, 
// we can use non-sealed
public non-sealed class TankHero extends Hero {
}
```

### Pattern Matching for instanceof

[JEP 394: Pattern Matching for instanceof](https://openjdk.java.net/jeps/394)

For an in-depth look, see [Oracle's documentation on Pattern Matching for instanceof](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html).

By adding in support for pattern matching on `instanceof` statements, Java 17 addresses the "`instanceof`-and-cast idiom", by extracting data that has been tested against a particular structure.

See this "`instanceof`-and-cast" example:

```java
if (object instanceOf Animal) {    Animal animal = (Animal) object; // Cast
    animal.makeSound();}
```

We can use the new pattern matching to streamline the above into this example below:

```java
if (object instanceof Animal animal) {    animal.makeSound();}
```

### Helpful NullPointerExceptions

[JEP 358: Helpful NullPointerExceptions](https://openjdk.java.net/jeps/358)

For a detailed example, see [entry on Helpful NullPointerExceptions](https://dzone.com/articles/whats-new-between-java-11-and-java-17#:~:text=7.-,Helpful%20NullPointerExceptions,-Helpful%20NullPointerExceptions%20will).

For example with the following Java statement:

```java
a.b.c.i = 99;
```

Before, a case where the `a.b` variable was null would see the following exception thrown:

```
Exception in thread "main" java.lang.NullPointerException
    at Prog.main(Prog.java:5)
```

The above message would be the same if either `a` or `a.b.c` was the null variable, and is thus not as helpful as developers may want it to be.

Now in Java 17 with the Helpful NullPointerExceptions, a case where the `a.b` variable was null would see the following exception thrown:

```
Exception in thread "main" java.lang.NullPointerException: 
    Cannot read field "c" because "a.b" is null
    at Prog.main(Prog.java:5)With this improvement, Java's `NullPointerException`s will be much more descriptive.
```

## Highlights for JDK 11

### String API Addition

Java11 added a few new methods to the String class: *isBlank*, *lines*, *strip*, *stripLeading*, *stripTrailing,* and *repeat*.

#### Repeat()

```java
@Test
public void whenRepeatStringTwice_thenGetStringTwice() {
    String output = "La ".repeat(2) + "Land";

    is(output).equals("La La Land");
}


```

#### Strip()

returns a string with all leading and trailing whitespaces removed

```java
@Test
public void whenStripString_thenReturnStringWithoutWhitespaces() {
 is("\n\t hello \u2005".strip()).equals("hello");
}
```

strip() determines whether the character is whitespace or not based on Character.isWhitespace(). In other words, it is aware of Unicode whitespace characters.
This is different from trim(), which defines space as any character that is less than or equal to the Unicode space character (U+0020). If we use trim() in the previous example, we will get a different result:

```java
@Test
public void whenTrimAdvanceString_thenReturnStringWithWhitespaces() {
    is("\n\t  hello   \u2005".trim()).equals("hello   \u2005");
}
```

#### isBlank()

returns true if the string is empty or contains only whitespace. Otherwise, it returns false:

```java
@Test
public void whenBlankString_thenReturnTrue() {
    assertTrue("\n\t\u2005  ".isBlank());
}
```

#### lines()

returns a Stream of lines extracted from the string, separated by line terminators (one of the following: *“\n”,* *“\r”,* or *“\r\n”*.):

```java
@Test
public void whenMultilineString_thenReturnNonEmptyLineCount() {
    String multilineStr = "This is\n \n a multiline\n string.";

    long lineCount = multilineStr.lines()
      .filter(String::isBlank)
      .count();

    is(lineCount).equals(3L);
}
```

### New File Methods

new readString and writeString static methods from the Files class:

```java
Path filePath = Files.writeString(Files.createTempFile(tempDir, "demo", ".txt"), "Sample text");
String fileContent = Files.readString(filePath);
assertThat(fileContent).isEqualTo("Sample text");
```

### List to an array

```java
List sampleList = Arrays.asList("Java", "Kotlin");
String[] sampleArray = sampleList.toArray(String[]::new);
assertThat(sampleArray).containsExactly("Java", "Kotlin");
```

### Predicate.not Method

```java
List<String> sampleList = Arrays.asList("Java", "\n \n", "Kotlin", " ");
List withoutBlanks = sampleList.stream()
  .filter(Predicate.not(String::isBlank))
  .collect(Collectors.toList());
assertThat(withoutBlanks).containsExactly("Java", "Kotlin");
```

### Local-Variable Syntax for Lambda

Support for using the [local variable syntax](https://www.baeldung.com/java-var-lambda-params) (*var* keyword) in lambda parameters was added in Java 11.

We can make use of this feature to apply modifiers to our local variables, like defining a type annotation:

```java
List<String> sampleList = Arrays.asList("Java", "Kotlin");
String resultString = sampleList.stream()
  .map((@Nonnull var x) -> x.toUpperCase())
  .collect(Collectors.joining(", "));
assertThat(resultString).isEqualTo("JAVA, KOTLIN");
```

### HTTP Client

```java
HttpClient httpClient = HttpClient.newBuilder()
  .version(HttpClient.Version.HTTP_2)
  .connectTimeout(Duration.ofSeconds(20))
  .build();
HttpRequest httpRequest = HttpRequest.newBuilder()
  .GET()
  .uri(URI.create("http://localhost:" + port))
  .build();
HttpResponse httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
assertThat(httpResponse.body()).isEqualTo("Hello from the server!");
```




