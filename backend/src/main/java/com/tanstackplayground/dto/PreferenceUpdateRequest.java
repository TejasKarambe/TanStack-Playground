package com.tanstackplayground.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceUpdateRequest {

    @Pattern(regexp = "^(light|dark|system)$", message = "Theme must be 'light', 'dark', or 'system'")
    private String theme;

    @Min(value = 10, message = "Font size must be at least 10")
    @Max(value = 28, message = "Font size must not exceed 28")
    private Integer editorFontSize;

    private Boolean editorWordWrap;

    @Pattern(regexp = "^(side-by-side|tabbed|stacked)$", message = "Layout must be 'side-by-side', 'tabbed', or 'stacked'")
    private String previewLayout;
}

