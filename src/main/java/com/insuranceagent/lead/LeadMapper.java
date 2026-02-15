package com.insuranceagent.lead;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LeadMapper {

    LeadResponse toResponse(Lead lead);

    List<LeadResponse> toResponseList(List<Lead> leads);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "leadNotes", ignore = true)
    Lead toEntity(LeadCreateRequest request);

    @Mapping(source = "lead.id", target = "leadId")
    LeadNoteResponse toNoteResponse(LeadNote leadNote);

    List<LeadNoteResponse> toNoteResponseList(List<LeadNote> leadNotes);
}
