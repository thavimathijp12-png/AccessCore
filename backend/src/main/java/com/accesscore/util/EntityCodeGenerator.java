package com.accesscore.util;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.function.Predicate;

/**
 * Generates collision-free sequential entity codes (e.g. REQ-0004, TSK-1004).
 */
@Component
public class EntityCodeGenerator {

    public String nextCode(String prefix, int digits, long minStart,
                           Collection<String> existingCodes, Predicate<String> existsCheck) {
        String expectedPrefix = prefix + "-";
        long maxSuffix = minStart - 1;

        for (String code : existingCodes) {
            if (code != null && code.startsWith(expectedPrefix)) {
                String suffix = code.substring(expectedPrefix.length());
                try {
                    long parsed = Long.parseLong(suffix);
                    if (parsed > maxSuffix) {
                        maxSuffix = parsed;
                    }
                } catch (NumberFormatException ignored) {
                    // Ignore custom non-numeric codes when computing next sequence
                }
            }
        }

        long next = Math.max(minStart, maxSuffix + 1);
        String format = "%s-%0" + digits + "d";
        String candidate = String.format(format, prefix, next);
        while (existsCheck.test(candidate)) {
            next++;
            candidate = String.format(format, prefix, next);
        }
        return candidate;
    }
}
