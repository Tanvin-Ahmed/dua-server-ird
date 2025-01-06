const { db } = require("../db/db");

const getAllCategory = async (req, res) => {
  try {
    const sql = `WITH OrderedSubcategories AS (
        SELECT 
            *
        FROM 
            sub_category
        ORDER BY 
            id ASC
    )
    SELECT 
        c.id,
        c.cat_id,
        c.cat_name_bn,
        c.cat_name_en,
        c.no_of_subcat,
        c.no_of_dua,
        c.cat_icon,
        JSON_GROUP_ARRAY(
            JSON_OBJECT(
                'id', os.id,
                'subcar_id', os.subcat_id,
                'subcat_name_bn', os.subcat_name_bn,
                'subcat_name_en', os.subcat_name_en,
                'no_of_dua', os.no_of_dua
            )
        ) AS sub_cats
    FROM 
        category c
    LEFT JOIN 
        OrderedSubcategories os
    ON 
        c.cat_id = os.cat_id
    GROUP BY 
        c.id, c.cat_id, c.cat_name_bn, c.cat_name_en, c.no_of_subcat, c.no_of_dua, c.cat_icon
    ORDER BY 
        c.id ASC;`;

    db.all(sql, (err, result) => {
      if (err) return res.status(404).json({ message: err.message });
      return res
        .status(200)
        .json(
          result.map((cat) => ({ ...cat, sub_cats: JSON.parse(cat.sub_cats) }))
        );
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const catId = req.params.catId;
    const sql = `SELECT * FROM sub_category WHERE cat_id =${catId} ORDER BY cat_id ASC`;
    db.all(sql, (err, result) => {
      if (err) return res.status(404).json({ message: err.message });
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const getDuaByCatAndSubCatId = async (req, res) => {
  try {
    const { catId, subCatId } = req.params;
    const sql = `SELECT * FROM dua WHERE cat_id=${catId} AND subcat_id=${subCatId}`;
    db.all(sql, (err, result) => {
      if (err) return res.status(404).json({ message: err.message });
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const getDuaNameByCatAndSubCatId = async (req, res) => {
  try {
    const { catId, subCatId } = req.params;
    const sql = `SELECT cat_id, subcat_id, dua_id, dua_name_en, dua_name_bn FROM dua WHERE cat_id=${catId} AND subcat_id=${subCatId} ORDER BY dua_id ASC`;
    db.all(sql, (err, result) => {
      if (err) return res.status(404).json({ message: err.message });
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const getCategoryNameByCatId = async (req, res) => {
  try {
    const { catId } = req.params;
    const sql = `SELECT cat_name_bn, cat_name_en, cat_id FROM category WHERE cat_id=${catId}`;
    db.get(sql, (err, result) => {
      if (err) return res.status(404).json({ message: err.message });
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const getAllInfoOfCategory = async (req, res) => {
  try {
    const catId = req.params.catId;
    const sql = `
              SELECT
                  c.cat_id AS category_id,
                  c.cat_name_en AS category_name_en,
                  c.cat_name_bn AS category_name_bn,
                  json_group_array(
                      json_object(
                          'subcat_id', sub.subcat_id,
                          'subcat_name_en', sub.subcat_name_en,
                          'subcat_name_bn', sub.subcat_name_bn,
                          'dua_list', json(sub.dua_list)
                      )
                  ) AS subcategories
              FROM category c
              LEFT JOIN (
                  SELECT
                      s.cat_id,
                      s.subcat_id,
                      s.subcat_name_en,
                      s.subcat_name_bn,
                      json_group_array(
                          json_object(
                              'dua_id', d.dua_id,
                              'dua_name_en', d.dua_name_en,
                              'dua_name_bn', d.dua_name_bn,
                              'top_bn', d.top_bn,
                              'top_en', d.top_en,
                              'dua_arabic', d.dua_arabic,
                              'dua_indopak', d.dua_indopak,
                              'clean_arabic', d.clean_arabic,
                              'transliteration_bn', d.transliteration_bn,
                              'transliteration_en', d.transliteration_en,
                              'translation_bn', d.translation_bn,
                              'translation_en', d.translation_en,
                              'bottom_bn', d.bottom_bn,
                              'bottom_en', d.bottom_en,
                              'refference_bn', d.refference_bn,
                              'refference_en', d.refference_en,
                              'audio', d.audio
                          )
                      ) AS dua_list
                  FROM sub_category s
                  LEFT JOIN (
                      SELECT * FROM dua ORDER BY dua_id ASC
                  ) d ON s.subcat_id = d.subcat_id
                  WHERE s.cat_id = ${catId}
                  GROUP BY s.subcat_id
              ) AS sub ON c.cat_id = sub.cat_id
              WHERE c.cat_id = ${catId}
              GROUP BY c.cat_id;
              `;

    db.get(sql, (err, result) => {
      if (err) return res.status(404).json({ message: err.message });
      let subcategories = [];
      if (result?.subcategories)
        subcategories = JSON.parse(result.subcategories);

      return res.status(200).json({ ...result, subcategories });
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getAllCategory,
  getSubcategoriesByCategoryId,
  getDuaByCatAndSubCatId,
  getDuaNameByCatAndSubCatId,
  getCategoryNameByCatId,
  getAllInfoOfCategory,
};
