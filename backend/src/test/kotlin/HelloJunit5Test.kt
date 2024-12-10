import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class HelloJunit5Test {
    @Test
    fun `Base assertions`() {
        assertEquals("a", "a")
        assertEquals(2, 1 + 1, "Trivial")
        assertEquals(2 + 2, 4)
    }
}
