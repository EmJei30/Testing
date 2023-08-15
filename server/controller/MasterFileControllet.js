const connection = require('../database/connection');

/** MASTER FILE */

/**Function to Fetch masterfile */
const getMasterFile = async (req, res)=>{
    // console.log(req.query.selectFile);
    const dbQuery = req.query.selectFile;
    let masterfile_db = '';

    if(dbQuery === 'Custumer_ax'){
        masterfile_db = 'ayh_customer_ax';
    }else if(dbQuery === 'Item_mastefile'){
        masterfile_db = 'ayh_item_master';
    }else{
        masterfile_db = 'ayh_customer_maintenance';
    }

    try {
        const query = `SELECT * FROM ${masterfile_db} WHERE ITEMGROUPID LIKE 'FG%'`;
        const results = await executeQuery2(query);
        // console.log('Resulst.', results);
        res.json(results);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};


/** Function to execute SQL queries / get all products*/
function executeQuery2(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                const headers = fields.map(field => field.name);
                resolve({ headers, data: results });
            }
        });
    });
};

/**Function to get masterfile by query */
const filterMasterFile = async (req, res) =>{
  console.log(req.body);
  const { Item_ID, item_Name, item_Description } = req.body;


    let query = ` SELECT * FROM ayh_item_master WHERE 1 = 1 `;
    const queryParams = [];

    if (Item_ID) {
    query += ` AND ITEMID LIKE ? `;
    queryParams.push(`%${Item_ID}%`);
    }

    if (item_Name) {
    query += ` AND ITEMNAME LIKE ? `;
    queryParams.push(`%${item_Name}%`);
    }

    if (item_Description) {
    query += ` AND DESCRIPTION LIKE ? `;
    queryParams.push(`%${item_Description}%`);
    }

  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error fetching filtered data:', error);
      res.status(500).json({ error: 'Failed to fetch filtered data' });
    } else {
      res.json(results);
      console.log("results ", results);
    }
  });
};

/**Function to insert uploader csv file to the database */
const uploadMasterFile = async(req, res) =>{

  const table = req.body.selectFile;
  const cvsFile = req.body.uploadedCsvFile; 
  let values = [];
  let query = '';
  console.log(table);
  /**Condition for insert data to database by selected table 
   * if selected table is Item_mastefile
  */
  if(table === 'Item_mastefile'){
    console.log(cvsFile)

    const newCvsFile = cvsFile.map(obj => {
      const code = obj.ITEMNAME?.substring(0, 9);
      const Product_key = obj.ITEMID + obj.CONFIG + obj.SIZE + obj.COLOR  + obj.STYLE ;
      // const code2 = obj.ITEMID?.substring(0, 3);
      // const code = code1 + '_' + code2;
      let Business_solutions;
      let Product_Category;
    
      if (code === 'SOAP- HAN' || code === 'SOAP- DIS' || code === 'ALCOHOL- ') {
        Business_solutions = 'Cleaning Solutions';
        Product_Category = 'Cleaning Chemicals';
      } 
      else if (code === 'HRTBR 6/1' || code === 'HRTBR 6/2' || code === 'HRTBR Eve' || code === 'HRTMG 6/2' || code === 'HRTMG Ins' || code === 'HRTPP 6/2' || code === 'HRTPP Eve' || code === 'HRTVP 6/1' || code === 'HRTVP 6/2') {
        Business_solutions ='Hand Roll Towels';
        Product_Category = 'Hand Roll Tissue ';
      } 
      else if (code === 'JRTBR Ins' || code === 'JRTCP Plu' || code === 'JRTPP 16/' || code === 'JRTPP Ins' || code === 'JRTPP Plu' || code === 'JRTVP 12/' || code === 'JRTVP 16/' || code === 'JRTVP Plu'){
        Business_solutions = 'Jumbo Roll Tissue';
        Product_Category = 'Jumbo Roll Tissue';
      }
      else if (code === 'BTCL PR I' || code === 'BTMG Inst' || code === 'BTMG PR I' || code === 'BTPP Inst' || code === 'BTPP Plus' || code === 'BTPP PR I' || code === 'BTVP Inst' || code === 'BTVP Plus' || code === 'BTVP PR I'){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Bathroom Tissue ';
      }
      else if (code === 'FTVP Inst'){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Facial Tissue ';
      }  
      else if (code === 'Bedliner ' || code === 'TNBR FLAT' || code === 'TNMG Flat' || code === 'TNVP FLAT'){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Flat Table Napkin';
      } 
      else if (code === 'BTMG Inte' || code === 'BTPP Inte' || code === 'BTVP Inte' || code === 'TNBR Inte' || code === 'TNMG Inte'){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Interleave Tissue ';
      } 
      else if (code === 'KTPP Inst' || code === 'KTVP Inst'){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Kitchen Towel';
      } 
      else if (code === 'TNBR Inst' || code === 'TNBR PCF ' || code === 'TNMG PCF ' || code === 'TNVP PCF  '){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Pre-cut Table Napkin';
      } 
      else if (code === 'TNBR QF I' || code === 'TNBR QF12' || code === 'TNBR QF5 ' || code === 'TNBR QF9 ' || code === 'TNMG Inst' || code === 'TNMG QF12' || code === 'TNMG QF5 ' || code === 'TNPP QF I' || code === 'TNVP QF I' || code === 'TNVP QF12' || code === 'TNVP QF5 ' || code === 'TNVP QF9 '){
        Business_solutions = 'Other Tissue Products';
        Product_Category = 'Quatro Folded Table Napkin';
      } 
      else if (code === 'PTBR Inst' || code === 'PTMG Inst' || code === 'PTPP Inst' || code === 'PTVP Inst'){
        Business_solutions = 'Paper Towels';
        Product_Category = 'Paper Towel';
      }
      else if (code === 'TRASH BAG'){
        Business_solutions = 'Trashbags';
        Product_Category = 'Oxo-Biodegradable Trash Bags';
      }
      else if (code === 'DISPENSER'){
        Business_solutions = 'Dispensers';
        Product_Category = 'Dispensers';
      }
      else{
        Business_solutions = 'Others';
        Product_Category = 'Others';
      }
      return { ...obj, Business_solutions, Product_Category, Product_key};
    });
   

    const placeholders = Array(newCvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
    newCvsFile.forEach(item => {
      
      values.push(
        item.ITEMID, item.SEARCHNAME, item.ITEMNAME, item.DESCRIPTION, item.UNITID, item.ITEMGROUPID, item.CONFIG,
        item.STYLE, item.COLOR, item.SIZE, item.PRODUCTBARCODE, item.CASEBARCODE, item.Product_key, item.Business_solutions, item.Product_Category);
    });
   
    query = `INSERT INTO ayh_item_master (ITEMID, SEARCHNAME, ITEMNAME, DESCRIPTION, UNITID, ITEMGROUPID, CONFIG, STYLE, COLOR, SIZE, PRODUCTBARCODE, CASEBARCODE, Product_key, Business_solutions, Product_Category, CREATE_AT, UPDATED_AT)
    VALUES ${placeholders}`;
    };

    /** IF Selected Table is Custumer_ax */
    if(table === 'Custumer_ax'){
        const placeholders = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
        cvsFile.forEach(item => {
        values.push(
        item.ACCOUNTNUM, item.INVOICEACCOUNT, item.NAME, item.SEARCH_NAME, item.COUNTRYREGIONID, item.CREDIT_LIMIT, item.CURRENCY, 
        item.CUSTGROUP, item.CLASSIFICATION_GROUP, item.TIN, item.ADDRESS, item.ADDRESS2, item.ADDRESS3,  item.LANGUAGEID, 
        item.LINEOFBUSINESSID, item.DLVTERMID, item.PAYMMODE, item.DLVMODEID, item.CONTACT_PERSON, item.PRIMARY, item.PRIMARY1, 
        item.RECORD_TYPE, item.COMMISSION,  item.SALES_TAXGROUP, item.CONTRACT_ADDRESS, item.SEGMENTID, item.SITE, 
        item.CUSTOMER_ADDRESS, item.PAYMTERMID, item.TYPE, item.WAREHOUSE, item.BUSINESSUNIT, item.COSTCENTER, item.DEPARTMENT, 
        item.SITE1,  item.AYH_PRODUCTGROUP, item.B20_PRODUCTGROUP, item.TRUCKING, item.TELEPHONE, item.SALESGROUP, item.PRICEGROUP
        );
    });
    
        query = `INSERT INTO ayh_customer_ax (ACCOUNTNUM, INVOICEACCOUNT, NAME, SEARCH_NAME, 
            COUNTRYREGIONID, CREDIT_LIMIT, CURRENCY, CUSTGROUP, CLASSIFICATION_GROUP, TIN,
            ADDRESS, ADDRESS2, ADDRESS3, LANGUAGEID, LINEOFBUSINESSID, DLVTERMID, PAYMMODE, DLVMODEID, CONTACT_PERSON, AX_PRIMARY,
            PRIMARY1, RECORD_TYPE, COMMISSION, SALES_TAXGROUP, CONTRACT_ADDRESS, SEGMENTID, SITE, CUSTOMER_ADDRESS, PAYMTERMID,
            AX_TYPE, WAREHOUSE, BUSINESSUNIT, COSTCENTER, DEPARTMENT, SITE1, AYH_PRODUCTGROUP, B20_PRODUCTGROUP,TRUCKING,
            TELEPHONE, SALESGROUP, PRICEGROUP, Created_at, Updated_at
        ) VALUES ${placeholders}`;
    };

    /** IF Selected Table is Customer_maintenance */
    if(table === 'Customer_maintenance'){
      const placeholders = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
        cvsFile.forEach(item => {
          values.push(item.AccountNum, item.CustName, item.SearchName, item.CustGroup, item.Currency, item.TaxGroup, 
            item.TranType, item.SalesAssignCode, item.AREA, item.REGION, item.CITY, item.DISIONTYPE, 
            item.DISTCHANNELNAME, item.CHANNELNAME, item.STORENAME, item.CUSTGROUPCODE);
        });
        
        query = `INSERT INTO ayh_customer_maintenance (AccountNum, CustName, SearchName, CustGroup, Currency, TaxGroup, TranType, 
            SalesAssignCode, AREA, REGION, CITY, DISIONTYPE, DISTCHANNELNAME, CHANNELNAME, STORENAME, CUSTGROUPCODE, Created_at, Updated_at
            ) VALUES ${placeholders}`;
    };


    /** IF Selected Table is Institutional */
    if(table === 'Institutional'){
        const placeholders = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
        cvsFile.forEach(item => {
          /**Convert the 'Pk_Case' value to an integer or set it to NULL if it's an empty string  */ 
          const iRolls_Cs = !isNaN(item.Rolls_Cs) && item.Rolls_Cs !== '' ? parseInt(item.Rolls_Cs) : null;
          const iPk_Case =  !isNaN(item.Pk_Case) && item.Pk_Case !== '' ? parseInt(item.Pk_Case) : null;
          const iRolls_Pk = !isNaN(item.Rolls_Pk) && item.Rolls_Pk !== '' ? parseInt(item.Rolls_Pk) : null;
          const iSheets_Roll = !isNaN(item.Sheets_Roll) && item.Sheets_Roll !== '' ? parseInt(item.Sheets_Roll) : null;
          const iPly = !isNaN(item.Ply) && item.Ply !== '' ? parseInt(item.Ply) : null;
          const iDIST_05_VAT_EX_CASE =  !isNaN(item.DIST_05_VAT_EX_CASE) && item.DIST_05_VAT_EX_CASE !== '' ? parseFloat( item.DIST_05_VAT_EX_CASE) : null;
          const iDIST_05_VAT_EX_UNIT = !isNaN(item.DIST_05_VAT_EX_UNIT) && item.DIST_05_VAT_EX_UNIT !== '' ? parseFloat(item.DIST_05_VAT_EX_UNIT) : null;
          const iDIST_04_VAT_IN_CASE = !isNaN(item.DIST_04_VAT_IN_CASE) && item.DIST_04_VAT_IN_CASE !== '' ? parseFloat(item.DIST_04_VAT_IN_CASE) : null;
          const iDIST_04_VAT_IN_UNIT = !isNaN(item.DIST_04_VAT_IN_UNIT) && item.DIST_04_VAT_IN_UNIT !== '' ? parseFloat(item.DIST_04_VAT_IN_UNIT) : null;
          const iDEAL_05_VAT_EX_CASE = !isNaN(item.DEAL_05_VAT_EX_CASE) && item.DEAL_05_VAT_EX_CASE !== '' ? parseFloat(item.DEAL_05_VAT_EX_CASE) : null;
          const iDEAL_05_VAT_EX_UNIT = !isNaN(item.DEAL_05_VAT_EX_UNIT) && item.DEAL_05_VAT_EX_UNIT !== '' ? parseFloat(item.DEAL_05_VAT_EX_UNIT,) : null;
          const iDEAL_04_VAT_IN_CASE =  !isNaN(item.DEAL_04_VAT_IN_CASE) && item.DEAL_04_VAT_IN_CASE !== '' ? parseFloat( item.DEAL_04_VAT_IN_CASE) : null;
          const iDEAL_04_VAT_IN_UNIT =  !isNaN(item.DEAL_04_VAT_IN_UNIT) && item.DEAL_04_VAT_IN_UNIT !== '' ? parseFloat( item.DEAL_04_VAT_IN_UNIT) : null;
          const iENDU_05_VAT_EX_CASE = !isNaN(item.ENDU_05_VAT_EX_CASE) && item.ENDU_05_VAT_EX_CASE !== '' ? parseFloat(item.ENDU_05_VAT_EX_CASE) : null;
          const iENDU_05_VAT_EX_UNIT = !isNaN(item.ENDU_05_VAT_EX_UNIT) && item.ENDU_05_VAT_EX_UNIT !== '' ? parseFloat(item.ENDU_05_VAT_EX_UNIT) : null;
          const iENDU_04_VAT_IN_CASE = !isNaN(item.ENDU_04_VAT_IN_CASE) && item.ENDU_04_VAT_IN_CASE !== '' ? parseFloat(item.ENDU_04_VAT_IN_CASE) : null;
          const iENDU_04_VAT_IN_UNIT= !isNaN(item.ENDU_04_VAT_IN_UNIT) && item.ENDU_04_VAT_IN_UNIT !== '' ? parseFloat(item.ENDU_04_VAT_IN_UNIT) : null;
          
          /**converting to */

          values.push(item.Business_solutions, item.Product_Category, item.Product_unique_key, item.Product_Code, item.Item_Name, 
            item.Config, item.Size, item.Color, item.Style, item.UM, item.Product_Description, item.Grade, iRolls_Cs, iPk_Case, 
            iRolls_Pk, iSheets_Roll, iPly, item.Standard_weight, iDIST_05_VAT_EX_CASE, iDIST_05_VAT_EX_UNIT, iDIST_04_VAT_IN_CASE, iDIST_04_VAT_IN_UNIT, 
            iDEAL_05_VAT_EX_CASE, iDEAL_05_VAT_EX_UNIT, iDEAL_04_VAT_IN_CASE, iDEAL_04_VAT_IN_UNIT, iENDU_05_VAT_EX_CASE, 
            iENDU_05_VAT_EX_UNIT, iENDU_04_VAT_IN_CASE, iENDU_04_VAT_IN_UNIT, new Date(item.Effectivity_date_start), new Date(item.Effectivity_date_end));
        });
         
        query = `INSERT INTO ayh_institutional (Business_solutions, Product_Category, Product_unique_key, Product_Code, Item_Name, Config, Size, Color,
        Style, UM, Product_Description, Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight, DIST_05_VAT_EX_CASE, DIST_05_VAT_EX_UNIT,
        DIST_04_VAT_IN_CASE, DIST_04_VAT_IN_UNIT, DEAL_05_VAT_EX_CASE, DEAL_05_VAT_EX_UNIT, DEAL_04_VAT_IN_CASE, DEAL_04_VAT_IN_UNIT,
        ENDU_05_VAT_EX_CASE, ENDU_05_VAT_EX_UNIT, ENDU_04_VAT_IN_CASE, ENDU_04_VAT_IN_UNIT, Effectivity_date_start, Effectivity_date_end, Created_at, Updated_at
        ) VALUES ${placeholders}`;
      };

      /** IF Selected Table is STA */
    if(table === 'STA'){
  
      const placeholders = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
        cvsFile.forEach(item => {
          // const sta_key = item.ACCOUNTRELATION + item.ITEMRELATION + item.CONFIGURATION + item.SIZE + item.COLOR + item.STYLE;
  
          const sta_key = [
            item.ACCOUNTRELATION,
            item.ITEMRELATION,
            item.CONFIGURATION,
            item.SIZE,
            item.COLOR,
            item.STYLE,
          ].join('');
          const PRICEUNIT = !isNaN(item.PRICEUNIT) && item.PRICEUNIT !== '' ? parseInt(item.PRICEUNIT) : null;
          const AMOUNT =  !isNaN(item.AMOUNT) && item.AMOUNT !== '' ? parseFloat(item.AMOUNT) : null;
          const QUANTITYAMOUNTFROM =  !isNaN(item.QUANTITYAMOUNTFROM) && item.QUANTITYAMOUNTFROM !== '' ? parseInt(item.QUANTITYAMOUNTFROM) : null;
          const QUANTITYAMOUNTTO = !isNaN(item.QUANTITYAMOUNTTO) && item.QUANTITYAMOUNTTO !== '' ? parseInt(item.QUANTITYAMOUNTTO) : null;
          const RECID = !isNaN(item.RECID) && item.RECID !== '' ? parseInt(item.RECID) : null;
          const CUSTCLASSIFICATIONID = !isNaN(item.CUSTCLASSIFICATIONID) && item.CUSTCLASSIFICATIONID !== '' ? parseInt(item.CUSTCLASSIFICATIONID) : null;
       
         
            values.push(
              sta_key, item.RELATION, item.ACCOUNTCODE, item.ACCOUNTRELATION, item.CUSTOMERNAME, item.ITEMCODE, item.ITEMRELATION, item.PRODUCTNAME,
              new Date(item.FROMDATE),  new Date(item.TODATE), AMOUNT, item.CURRENCY, PRICEUNIT, item.UNITID, QUANTITYAMOUNTFROM, QUANTITYAMOUNTTO, 
              item.CONFIGURATION, item.SIZE, item.STYLE, item.COLOR, item.SITE, CUSTCLASSIFICATIONID, item.PRODUCTNAME1, 
              item.PRODUCTNAME1, new Date(item.ModifiedDatetime), RECID
            ); 
      });
        query = `INSERT INTO ayh_sta (sta_key, RELATION, ACCOUNTCODE, ACCOUNTRELATION, CUSTOMERNAME, ITEMCODE, ITEMRELATION, PRODUCTNAME,
          FROMDATE, TODATE, AMOUNT, CURRENCY, PRICEUNIT, UNITID, QUANTITYAMOUNTFROM, QUANTITYAMOUNTTO, CONFIGURATION, SIZE, STYLE, COLOR, SITE,
          CUSTCLASSIFICATIONID, PRODUCTNAME1, DESCRIPTION, ModifiedDatetime, RECID, Created_at, Updated_at
            ) VALUES ${placeholders}`;
    };

    /**------------- ----------------------*/
 /** IF Selected Table is Institutional */
 if(table === 'BRANDED'){
  const placeholders = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
  cvsFile.forEach(item => {
    /**Convert the 'Pk_Case' value to an integer or set it to NULL if it's an empty string  */ 
    const iRolls_Cs = !isNaN(item.Rolls_Cs) && item.Rolls_Cs !== '' ? parseInt(item.Rolls_Cs) : null;
    const iPk_Case =  !isNaN(item.Pk_Case) && item.Pk_Case !== '' ? parseInt(item.Pk_Case) : null;
    const iRolls_Pk = !isNaN(item.Rolls_Pk) && item.Rolls_Pk !== '' ? parseInt(item.Rolls_Pk) : null;
    const iSheets_Roll = !isNaN(item.Sheets_Roll) && item.Sheets_Roll !== '' ? parseInt(item.Sheets_Roll) : null;
    const iPly = !isNaN(item.Ply) && item.Ply !== '' ? parseInt(item.Ply) : null;
    const iVATex =  !isNaN(item.VATex) && item.VATex !== '' ? parseFloat( item.VATex) : null;
    const iDistributor_Price = !isNaN(item.Distributor_Price) && item.Distributor_Price !== '' ? parseFloat(item.Distributor_Price) : null;
    const iDP_Unit = !isNaN(item.DP_Unit) && item.DP_Unit !== '' ? parseFloat(item.DP_Unit) : null;
    const iMargin = !isNaN(item.Margin) && item.Margin !== '' ? parseFloat(item.Margin) : null;
    const iList_Price_Value = !isNaN(item.List_Price_Value) && item.List_Price_Value !== '' ? parseFloat(item.List_Price_Value) : null;
    const iLP_Unit = !isNaN(item.LP_Unit) && item.LP_Unit !== '' ? parseFloat(item.LP_Unit,) : null;
    const iMarkup =  !isNaN(item.Markup) && item.Markup !== '' ? parseFloat( item.Markup) : null;
    const iSRP_Price_Cs =  !isNaN(item.SRP_Price_Cs) && item.SRP_Price_Cs !== '' ? parseFloat( item.SRP_Price_Cs) : null;
    const iSRP = !isNaN(item.SRP) && item.SRP !== '' ? parseFloat(item.SRP) : null;
   
    
    /**converting to */

    values.push(item.Business_solutions, item.Product_Category, item.Product_unique_key, item.Product_Code, item.Item_Name, 
      item.Config, item.Size, item.Color, item.Style, item.UM, item.Product_Description, item.Grade, item.Bg_Cs, iRolls_Cs, iPk_Case, 
      iRolls_Pk, iSheets_Roll, iPly, item.Standard_weight, iVATex, iDistributor_Price, iDP_Unit, iMargin, iList_Price_Value, iLP_Unit,
      iMarkup, iSRP_Price_Cs, iSRP);
  });
   
  query = `INSERT INTO ayh_branded (Business_solutions, Product_Category, Product_unique_key, Product_Code, Item_Name, Config, Size, Color,
  Style, UM, Product_Description, Grade, Bg_Cs, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight,  VATex, Distributor_Price, DP_Unit, 
  Margin, List_Price_Value, LP_Unit, Markup, SRP_Price_Cs, SRP, Created_at, Updated_at
  ) VALUES ${placeholders}`;
};


    /**---------------------------------- */
      console.log('Generated SQL query:', query);
      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('An error occurred:', error);
          res.status(500).send('Error saving data');
        } else {
          console.log('Data saved successfully!');
            if(table === 'STA'){
              let values1 = [];
              let query1 = '';
                const placeholders1 = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
                cvsFile.forEach(item => {
                  // const sta_key = item.ACCOUNTRELATION + item.ITEMRELATION + item.CONFIGURATION + item.SIZE + item.COLOR + item.STYLE;
          
                  const unique_key = [
                    item.ACCOUNTRELATION,
                    item.ITEMRELATION,
                    item.CONFIGURATION,
                    item.SIZE,
                    item.COLOR,
                    item.STYLE,
                  ].join('');
                  const PRICEUNIT = !isNaN(item.PRICEUNIT) && item.PRICEUNIT !== '' ? parseInt(item.PRICEUNIT) : null;
                  const AMOUNT =  !isNaN(item.AMOUNT) && item.AMOUNT !== '' ? parseFloat(item.AMOUNT) : null;
                  const QUANTITYAMOUNTFROM =  !isNaN(item.QUANTITYAMOUNTFROM) && item.QUANTITYAMOUNTFROM !== '' ? parseInt(item.QUANTITYAMOUNTFROM) : null;
                  const QUANTITYAMOUNTTO = !isNaN(item.QUANTITYAMOUNTTO) && item.QUANTITYAMOUNTTO !== '' ? parseInt(item.QUANTITYAMOUNTTO) : null;
                  const RECID = !isNaN(item.RECID) && item.RECID !== '' ? parseInt(item.RECID) : null;
                  const CUSTCLASSIFICATIONID = !isNaN(item.CUSTCLASSIFICATIONID) && item.CUSTCLASSIFICATIONID !== '' ? parseInt(item.CUSTCLASSIFICATIONID) : null;
         
                
                    values1.push(item.ACCOUNTRELATION, unique_key, item.ITEMRELATION, item.PRODUCTNAME, item.CONFIGURATION, item.SIZE, item.COLOR,
                      item.STYLE, item.UNITID, item.PRODUCTNAME1, null, null,null, null, null, null, item.Standard_weight, AMOUNT, null
                      
                    ); 
              });
                query1 = `INSERT INTO ayh_price_group (ACCOUNTRELATION, unique_key, Product_Code, Item_Name, Config, Size, Color, Style,
                  UM, Product_Description, Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight,  Price_case, Price_unit,  Created_at, Updated_at
                    ) VALUES ${placeholders1}`;
              
                    connection.query(query1, values1, (error, results) => {
                      if (error) {
                        console.error('An error occurred:', error);
                        res.status(500).send('Error saving data');
                      } else {
                        console.log('Data saved successfully!');
                        res.status(200).send(`${table}Data saved successfully`);
                      }
                    });
            }else{
              res.status(200).send(`${table}Data saved successfully`);
            }
        }
      });
  
};

module.exports ={
    getMasterFile,
    uploadMasterFile,
    filterMasterFile
}