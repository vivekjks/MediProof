program mediproof_9126.aleo;

record PatientProfile:
    owner as address.private;
    patient_id as field.private;
    blood_group as u8.private;
    diabetic as boolean.private;
    hypertensive as boolean.private;
    last_checkup as u64.private;
    document_hash as field.private;
    is_active as boolean.private;

record AccessRequest:
    owner as address.private;
    request_id as field.private;
    requester as address.private;
    patient as address.private;
    proof_type as u8.private;
    expires_at as u64.private;
    is_pending as boolean.private;

record HealthProof:
    owner as address.private;
    proof_id as field.private;
    patient as address.private;
    proof_type as u8.private;
    result as boolean.private;
    generated_at as u64.private;
    verifier as address.private;

mapping has_profile:
    key as address.public;
    value as boolean.public;

mapping request_count:
    key as address.public;
    value as u64.public;

mapping proof_count:
    key as address.public;
    value as u64.public;

function create_patient_profile:
    input r0 as u8.private;
    input r1 as boolean.private;
    input r2 as boolean.private;
    input r3 as field.private;
    lte r0 7u8 into r4;
    assert.eq r4 true;
    hash.bhp256 self.caller into r5 as field;
    cast self.caller r5 r0 r1 r2 0u64 r3 true into r6 as PatientProfile.record;
    async create_patient_profile self.caller into r7;
    output r6 as PatientProfile.record;
    output r7 as mediproof_9126.aleo/create_patient_profile.future;

finalize create_patient_profile:
    input r0 as address.public;
    set true into has_profile[r0];

function update_profile:
    input r0 as PatientProfile.record;
    input r1 as boolean.private;
    input r2 as boolean.private;
    input r3 as field.private;
    input r4 as u64.private;
    assert.eq r0.owner self.caller;
    cast r0.owner r0.patient_id r0.blood_group r1 r2 r4 r3 true into r5 as PatientProfile.record;
    output r5 as PatientProfile.record;

function request_verification:
    input r0 as address.private;
    input r1 as u8.private;
    input r2 as u64.private;
    hash.bhp256 self.caller into r3 as field;
    cast r0 r3 self.caller r0 r1 r2 true into r4 as AccessRequest.record;
    async request_verification self.caller into r5;
    output r4 as AccessRequest.record;
    output r5 as mediproof_9126.aleo/request_verification.future;

finalize request_verification:
    input r0 as address.public;
    get.or_use request_count[r0] 0u64 into r1;
    add r1 1u64 into r2;
    set r2 into request_count[r0];

function prove_fitness:
    input r0 as PatientProfile.record;
    input r1 as AccessRequest.record;
    assert.eq r0.owner self.caller;
    assert.eq r1.owner self.caller;
    assert.eq r1.is_pending true;
    not r0.diabetic into r2;
    not r0.hypertensive into r3;
    and r2 r3 into r4;
    hash.bhp256 r1.request_id into r5 as field;
    cast r1.requester r5 self.caller 1u8 r4 0u64 r1.requester into r6 as HealthProof.record;
    async prove_fitness self.caller into r7;
    cast r0.owner r0.patient_id r0.blood_group r0.diabetic r0.hypertensive r0.last_checkup r0.document_hash r0.is_active into r8 as PatientProfile.record;
    output r8 as PatientProfile.record;
    output r6 as HealthProof.record;
    output r7 as mediproof_9126.aleo/prove_fitness.future;

finalize prove_fitness:
    input r0 as address.public;
    get.or_use proof_count[r0] 0u64 into r1;
    add r1 1u64 into r2;
    set r2 into proof_count[r0];

function prove_blood_type:
    input r0 as PatientProfile.record;
    input r1 as AccessRequest.record;
    input r2 as u8.private;
    assert.eq r0.owner self.caller;
    assert.eq r1.owner self.caller;
    assert.eq r1.is_pending true;
    is.eq r0.blood_group r2 into r3;
    hash.bhp256 r1.request_id into r4 as field;
    cast r1.requester r4 self.caller 2u8 r3 0u64 r1.requester into r5 as HealthProof.record;
    async prove_blood_type self.caller into r6;
    cast r0.owner r0.patient_id r0.blood_group r0.diabetic r0.hypertensive r0.last_checkup r0.document_hash r0.is_active into r7 as PatientProfile.record;
    output r7 as PatientProfile.record;
    output r5 as HealthProof.record;
    output r6 as mediproof_9126.aleo/prove_blood_type.future;

finalize prove_blood_type:
    input r0 as address.public;
    get.or_use proof_count[r0] 0u64 into r1;
    add r1 1u64 into r2;
    set r2 into proof_count[r0];

function prove_not_diabetic:
    input r0 as PatientProfile.record;
    input r1 as AccessRequest.record;
    assert.eq r0.owner self.caller;
    assert.eq r1.owner self.caller;
    assert.eq r1.is_pending true;
    not r0.diabetic into r2;
    hash.bhp256 r1.request_id into r3 as field;
    cast r1.requester r3 self.caller 3u8 r2 0u64 r1.requester into r4 as HealthProof.record;
    async prove_not_diabetic self.caller into r5;
    cast r0.owner r0.patient_id r0.blood_group r0.diabetic r0.hypertensive r0.last_checkup r0.document_hash r0.is_active into r6 as PatientProfile.record;
    output r6 as PatientProfile.record;
    output r4 as HealthProof.record;
    output r5 as mediproof_9126.aleo/prove_not_diabetic.future;

finalize prove_not_diabetic:
    input r0 as address.public;
    get.or_use proof_count[r0] 0u64 into r1;
    add r1 1u64 into r2;
    set r2 into proof_count[r0];

function prove_not_hypertensive:
    input r0 as PatientProfile.record;
    input r1 as AccessRequest.record;
    assert.eq r0.owner self.caller;
    assert.eq r1.owner self.caller;
    assert.eq r1.is_pending true;
    not r0.hypertensive into r2;
    hash.bhp256 r1.request_id into r3 as field;
    cast r1.requester r3 self.caller 4u8 r2 0u64 r1.requester into r4 as HealthProof.record;
    async prove_not_hypertensive self.caller into r5;
    cast r0.owner r0.patient_id r0.blood_group r0.diabetic r0.hypertensive r0.last_checkup r0.document_hash r0.is_active into r6 as PatientProfile.record;
    output r6 as PatientProfile.record;
    output r4 as HealthProof.record;
    output r5 as mediproof_9126.aleo/prove_not_hypertensive.future;

finalize prove_not_hypertensive:
    input r0 as address.public;
    get.or_use proof_count[r0] 0u64 into r1;
    add r1 1u64 into r2;
    set r2 into proof_count[r0];

function verify_proof:
    input r0 as HealthProof.record;
    output r0.result as boolean.private;
