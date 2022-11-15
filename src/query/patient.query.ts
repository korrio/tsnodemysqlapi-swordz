export const QUERY = {
    SELECT_PATIENTS: 'SELECT * FROM patients ORDER BY created_at DESC LIMIT 50',
    SELECT_PATIENT: 'SELECT * FROM patients WHERE id = ?',
    SELECT_PATIENT_ADDRESS: 'SELECT * FROM patients WHERE address = ?',
    CREATE_PATIENT: 'INSERT INTO patients(first_name, last_name, email, address, diagnosis, phone, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    UPDATE_PATIENT: 'UPDATE patients SET first_name = ?, last_name = ?, email = ?, address = ?, diagnosis = ?, phone = ?, status = ?, image_url = ? WHERE id = ?',
    DELETE_PATIENT: 'DELETE FROM patients WHERE id = ?',
    UPDATE_SWORDZ: 'UPDATE patients SET swordz = swordz + ? WHERE id = ?'
};
