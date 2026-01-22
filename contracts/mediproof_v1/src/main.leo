program mediproof_9126.aleo {
    
    record PatientProfile {
        owner: address,
        patient_id: field,
        blood_group: u8,
        diabetic: bool,
        hypertensive: bool,
        last_checkup: u64,
        document_hash: field,
        is_active: bool,
    }
    
    record AccessRequest {
        owner: address,
        request_id: field,
        requester: address,
        patient: address,
        proof_type: u8,
        expires_at: u64,
        is_pending: bool,
    }
    
    record HealthProof {
        owner: address,
        proof_id: field,
        patient: address,
        proof_type: u8,
        result: bool,
        generated_at: u64,
        verifier: address,
    }
    
    mapping has_profile: address => bool;
    mapping request_count: address => u64;
    mapping proof_count: address => u64;
    
    async transition create_patient_profile(
        blood_group: u8,
        diabetic: bool,
        hypertensive: bool,
        document_hash: field
    ) -> (PatientProfile, Future) {
        assert(blood_group <= 7u8);
        
        let patient_id: field = BHP256::hash_to_field(self.caller);
        
        let profile: PatientProfile = PatientProfile {
            owner: self.caller,
            patient_id: patient_id,
            blood_group: blood_group,
            diabetic: diabetic,
            hypertensive: hypertensive,
            last_checkup: 0u64,
            document_hash: document_hash,
            is_active: true,
        };
        
        return (profile, finalize_create_profile(self.caller));
    }
    
    async function finalize_create_profile(caller: address) {
        Mapping::set(has_profile, caller, true);
    }
    
    transition update_profile(
        profile: PatientProfile,
        new_diabetic: bool,
        new_hypertensive: bool,
        new_document_hash: field,
        new_checkup_time: u64
    ) -> PatientProfile {
        assert_eq(profile.owner, self.caller);
        
        return PatientProfile {
            owner: profile.owner,
            patient_id: profile.patient_id,
            blood_group: profile.blood_group,
            diabetic: new_diabetic,
            hypertensive: new_hypertensive,
            last_checkup: new_checkup_time,
            document_hash: new_document_hash,
            is_active: true,
        };
    }
    
    async transition request_verification(
        patient: address,
        proof_type: u8,
        expires_at: u64
    ) -> (AccessRequest, Future) {
        let request_id: field = BHP256::hash_to_field(self.caller);
        
        let request: AccessRequest = AccessRequest {
            owner: patient,
            request_id: request_id,
            requester: self.caller,
            patient: patient,
            proof_type: proof_type,
            expires_at: expires_at,
            is_pending: true,
        };
        
        return (request, finalize_request(self.caller));
    }
    
    async function finalize_request(requester: address) {
        let current: u64 = Mapping::get_or_use(request_count, requester, 0u64);
        Mapping::set(request_count, requester, current + 1u64);
    }
    
    async transition prove_fitness(
        profile: PatientProfile,
        request: AccessRequest
    ) -> (PatientProfile, HealthProof, Future) {
        assert_eq(profile.owner, self.caller);
        assert_eq(request.owner, self.caller);
        assert(request.is_pending);
        
        let is_fit: bool = !profile.diabetic && !profile.hypertensive;
        let proof_id: field = BHP256::hash_to_field(request.request_id);
        
        let proof: HealthProof = HealthProof {
            owner: request.requester,
            proof_id: proof_id,
            patient: self.caller,
            proof_type: 1u8,
            result: is_fit,
            generated_at: 0u64,
            verifier: request.requester,
        };
        
        return (profile, proof, finalize_proof(self.caller));
    }
    
    async function finalize_proof(patient: address) {
        let current: u64 = Mapping::get_or_use(proof_count, patient, 0u64);
        Mapping::set(proof_count, patient, current + 1u64);
    }
    
    async transition prove_blood_type(
        profile: PatientProfile,
        request: AccessRequest,
        expected_blood_group: u8
    ) -> (PatientProfile, HealthProof, Future) {
        assert_eq(profile.owner, self.caller);
        assert_eq(request.owner, self.caller);
        assert(request.is_pending);
        
        let matches: bool = profile.blood_group == expected_blood_group;
        let proof_id: field = BHP256::hash_to_field(request.request_id);
        
        let proof: HealthProof = HealthProof {
            owner: request.requester,
            proof_id: proof_id,
            patient: self.caller,
            proof_type: 2u8,
            result: matches,
            generated_at: 0u64,
            verifier: request.requester,
        };
        
        return (profile, proof, finalize_proof(self.caller));
    }
    
    async transition prove_not_diabetic(
        profile: PatientProfile,
        request: AccessRequest
    ) -> (PatientProfile, HealthProof, Future) {
        assert_eq(profile.owner, self.caller);
        assert_eq(request.owner, self.caller);
        assert(request.is_pending);
        
        let not_diabetic: bool = !profile.diabetic;
        let proof_id: field = BHP256::hash_to_field(request.request_id);
        
        let proof: HealthProof = HealthProof {
            owner: request.requester,
            proof_id: proof_id,
            patient: self.caller,
            proof_type: 3u8,
            result: not_diabetic,
            generated_at: 0u64,
            verifier: request.requester,
        };
        
        return (profile, proof, finalize_proof(self.caller));
    }
    
    async transition prove_not_hypertensive(
        profile: PatientProfile,
        request: AccessRequest
    ) -> (PatientProfile, HealthProof, Future) {
        assert_eq(profile.owner, self.caller);
        assert_eq(request.owner, self.caller);
        assert(request.is_pending);
        
        let not_hypertensive: bool = !profile.hypertensive;
        let proof_id: field = BHP256::hash_to_field(request.request_id);
        
        let proof: HealthProof = HealthProof {
            owner: request.requester,
            proof_id: proof_id,
            patient: self.caller,
            proof_type: 4u8,
            result: not_hypertensive,
            generated_at: 0u64,
            verifier: request.requester,
        };
        
        return (profile, proof, finalize_proof(self.caller));
    }
    
    transition verify_proof(proof: HealthProof) -> bool {
        return proof.result;
    }
}
